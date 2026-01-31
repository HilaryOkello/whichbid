"""Typer CLI entrypoint."""

import json
from pathlib import Path

import typer
from dotenv import load_dotenv
from rich.console import Console
from rich.prompt import Prompt, Confirm
from rich.table import Table

from core.models import ComparisonCriteria
from core.pipeline import run

# Load environment variables
load_dotenv()

app = typer.Typer(
    name="whichbid",
    help="Compare and analyze vendor quotes with AI-powered insights",
    no_args_is_help=True,
    add_completion=False,
)
console = Console()


@app.callback(invoke_without_command=True)
def main(ctx: typer.Context) -> None:
    """WhichBid - Compare and analyze vendor quotes with AI."""
    if ctx.invoked_subcommand is None:
        console.print(ctx.get_help())


def parse_priorities(priorities: str | None) -> list[str]:
    """Parse comma-separated priorities string."""
    if not priorities:
        return ["price"]
    return [p.strip() for p in priorities.split(",")]


def parse_must_include(must_include: str | None) -> list[str] | None:
    """Parse comma-separated must-include string."""
    if not must_include:
        return None
    return [m.strip() for m in must_include.split(",")]


def prompt_for_criteria() -> ComparisonCriteria:
    """Interactively prompt user for comparison criteria."""
    console.print("\n[bold cyan]Configure Comparison Criteria[/bold cyan]")
    console.print("(Press Enter to skip and use defaults)\n")

    # Priorities
    console.print("[dim]Examples: price, timeline, warranty, quality, scope[/dim]")
    priorities_input = Prompt.ask(
        "Enter priorities (comma-separated, in order of importance)",
        default="price"
    )
    priorities = [p.strip() for p in priorities_input.split(",") if p.strip()]

    # Must include
    console.print("\n[dim]Examples: permits, insurance, warranty, cleanup[/dim]")
    must_include_input = Prompt.ask(
        "Required items that must be included",
        default=""
    )
    must_include = [m.strip() for m in must_include_input.split(",") if m.strip()] or None

    # Budget
    budget_input = Prompt.ask(
        "\nMaximum budget (leave empty for no limit)",
        default=""
    )
    budget = float(budget_input) if budget_input else None

    # Notes
    notes = Prompt.ask(
        "\nAdditional notes/context",
        default=""
    ) or None

    console.print()
    return ComparisonCriteria(
        priorities=priorities,
        must_include=must_include,
        budget_limit=budget,
        notes=notes,
    )


def print_table(analysis) -> None:
    """Print analysis results as a rich table."""
    # Ranking table
    table = Table(title="Quote Rankings")
    table.add_column("Rank", style="cyan", justify="right")
    table.add_column("Vendor", style="green")
    table.add_column("Base Price", justify="right")
    table.add_column("True Total", justify="right")
    table.add_column("Score", justify="right", style="yellow")
    table.add_column("Pros", style="green")
    table.add_column("Cons", style="red")

    for i, rq in enumerate(analysis.ranking, 1):
        table.add_row(
            str(i),
            rq.vendor,
            f"${rq.base_price:,.2f}",
            f"${rq.true_total:,.2f}",
            f"{rq.score:.0f}",
            "\n".join(f"+ {p}" for p in rq.pros[:2]),
            "\n".join(f"- {c}" for c in rq.cons[:2]),
        )

    console.print(table)
    console.print()

    # Hidden costs
    if analysis.hidden_costs:
        hc_table = Table(title="Hidden Costs Detected")
        hc_table.add_column("Vendor", style="yellow")
        hc_table.add_column("Item")
        hc_table.add_column("Est. Amount", justify="right")
        hc_table.add_column("Reason")

        for hc in analysis.hidden_costs:
            hc_table.add_row(
                hc.vendor,
                hc.item,
                f"${hc.estimated_amount:,.2f}",
                hc.reason,
            )
        console.print(hc_table)
        console.print()

    # Recommendation
    console.print("[bold]Recommendation:[/bold]")
    console.print(analysis.recommendation)
    console.print()

    # Reasoning
    console.print("[bold]Reasoning:[/bold]")
    console.print(analysis.reasoning)
    console.print()

    # Confidence and caveats
    console.print(f"[bold]Confidence:[/bold] {analysis.confidence:.0%}")
    if analysis.caveats:
        console.print("[bold]Caveats:[/bold]")
        for caveat in analysis.caveats:
            console.print(f"  - {caveat}")


@app.command()
def analyze(
    files: list[Path] = typer.Argument(
        ...,
        help="PDF quote files to analyze",
        exists=True,
        readable=True,
    ),
    interactive: bool = typer.Option(
        False,
        "--interactive", "-i",
        help="Interactively prompt for comparison criteria",
    ),
    priorities: str = typer.Option(
        None,
        "--priorities", "-p",
        help="Comma-separated priorities in order of importance (e.g., 'price,timeline,warranty')",
    ),
    must_include: str = typer.Option(
        None,
        "--must-include", "-m",
        help="Comma-separated required items (e.g., 'permits,insurance')",
    ),
    budget: float = typer.Option(
        None,
        "--budget", "-b",
        help="Maximum acceptable budget",
    ),
    notes: str = typer.Option(
        None,
        "--notes", "-n",
        help="Additional context for the analysis",
    ),
    output_format: str = typer.Option(
        "table",
        "--format", "-f",
        help="Output format: 'table' or 'json'",
    ),
) -> None:
    """Analyze and compare vendor quotes."""
    # Validate files are PDFs
    for f in files:
        if not f.suffix.lower() == ".pdf":
            console.print(f"[red]Error: {f} is not a PDF file[/red]")
            raise typer.Exit(1)

    # Build criteria - interactive or from options
    if interactive:
        criteria = prompt_for_criteria()
    else:
        criteria = ComparisonCriteria(
            priorities=parse_priorities(priorities),
            must_include=parse_must_include(must_include),
            budget_limit=budget,
            notes=notes,
        )

    console.print(f"[bold]Analyzing {len(files)} quote(s)...[/bold]")

    try:
        analysis = run([str(f) for f in files], criteria)

        if output_format == "json":
            console.print(analysis.model_dump_json(indent=2))
        else:
            print_table(analysis)

    except ValueError as e:
        console.print(f"[red]Error: {e}[/red]")
        raise typer.Exit(1)
    except Exception as e:
        console.print(f"[red]Unexpected error: {e}[/red]")
        raise typer.Exit(1)


if __name__ == "__main__":
    app()
