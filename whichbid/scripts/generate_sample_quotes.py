"""Generate sample quote PDFs for testing."""

from fpdf import FPDF
from pathlib import Path


def create_quote_pdf(filename: str, data: dict) -> None:
    """Create a quote PDF from structured data."""
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    # Header
    pdf.set_font("Helvetica", "B", 20)
    pdf.cell(0, 15, data["company_name"], ln=True, align="C")

    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 6, data["address"], ln=True, align="C")
    pdf.cell(0, 6, f"Phone: {data['phone']} | Email: {data['email']}", ln=True, align="C")
    pdf.ln(10)

    # Quote title
    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, "QUOTE", ln=True, align="C")
    pdf.ln(5)

    # Quote details
    pdf.set_font("Helvetica", "", 11)
    pdf.cell(95, 7, f"Quote #: {data['quote_number']}", ln=False)
    pdf.cell(95, 7, f"Date: {data['date']}", ln=True, align="R")
    pdf.cell(95, 7, f"Valid Until: {data['valid_until']}", ln=True)
    pdf.ln(5)

    # Customer info
    pdf.set_font("Helvetica", "B", 11)
    pdf.cell(0, 7, "Bill To:", ln=True)
    pdf.set_font("Helvetica", "", 11)
    pdf.cell(0, 6, data["customer_name"], ln=True)
    pdf.cell(0, 6, data["customer_address"], ln=True)
    pdf.ln(10)

    # Line items header
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_fill_color(230, 230, 230)
    pdf.cell(80, 8, "Description", border=1, fill=True)
    pdf.cell(25, 8, "Category", border=1, fill=True, align="C")
    pdf.cell(20, 8, "Qty", border=1, fill=True, align="C")
    pdf.cell(30, 8, "Unit Price", border=1, fill=True, align="R")
    pdf.cell(35, 8, "Total", border=1, fill=True, align="R")
    pdf.ln()

    # Line items
    pdf.set_font("Helvetica", "", 10)
    subtotal = 0
    for item in data["line_items"]:
        pdf.cell(80, 7, item["description"][:40], border=1)
        pdf.cell(25, 7, item["category"], border=1, align="C")
        pdf.cell(20, 7, str(item.get("qty", "-")), border=1, align="C")
        unit_price = item.get("unit_price", "")
        pdf.cell(30, 7, f"${unit_price:,.2f}" if unit_price else "-", border=1, align="R")
        pdf.cell(35, 7, f"${item['total']:,.2f}", border=1, align="R")
        pdf.ln()
        subtotal += item["total"]

    pdf.ln(5)

    # Totals
    pdf.set_font("Helvetica", "", 11)
    pdf.cell(155, 7, "Subtotal:", align="R")
    pdf.cell(35, 7, f"${subtotal:,.2f}", align="R", ln=True)

    if data.get("tax"):
        pdf.cell(155, 7, f"Tax ({data['tax_rate']}%):", align="R")
        pdf.cell(35, 7, f"${data['tax']:,.2f}", align="R", ln=True)

    pdf.set_font("Helvetica", "B", 12)
    total = subtotal + (data.get("tax", 0))
    pdf.cell(155, 8, "TOTAL:", align="R")
    pdf.cell(35, 8, f"${total:,.2f}", align="R", ln=True)

    pdf.ln(10)

    # Payment terms
    if data.get("payment_terms"):
        pdf.set_font("Helvetica", "B", 11)
        pdf.cell(0, 7, "Payment Terms:", ln=True)
        pdf.set_font("Helvetica", "", 10)
        pdf.multi_cell(0, 6, data["payment_terms"])
        pdf.ln(5)

    # Timeline
    if data.get("timeline"):
        pdf.set_font("Helvetica", "B", 11)
        pdf.cell(0, 7, "Project Timeline:", ln=True)
        pdf.set_font("Helvetica", "", 10)
        pdf.multi_cell(0, 6, data["timeline"])
        pdf.ln(5)

    # Notes
    if data.get("notes"):
        pdf.set_font("Helvetica", "B", 11)
        pdf.cell(0, 7, "Notes:", ln=True)
        pdf.set_font("Helvetica", "", 10)
        pdf.multi_cell(0, 6, data["notes"])

    # Save
    pdf.output(filename)
    print(f"Created: {filename}")


# Sample quote data for 3 different vendors
QUOTES = [
    {
        "company_name": "ABC Renovations Inc.",
        "address": "123 Builder Lane, Construction City, CA 90210",
        "phone": "(555) 123-4567",
        "email": "quotes@abcrenovations.com",
        "quote_number": "Q-2024-0142",
        "date": "January 15, 2024",
        "valid_until": "February 15, 2024",
        "customer_name": "John Smith",
        "customer_address": "456 Homeowner St, Residential Town, CA 90211",
        "line_items": [
            {"description": "Kitchen demolition", "category": "Labor", "qty": 1, "unit_price": 2500, "total": 2500},
            {"description": "Cabinet installation (12 units)", "category": "Labor", "qty": 12, "unit_price": 150, "total": 1800},
            {"description": "Custom cabinets - maple", "category": "Materials", "qty": 12, "unit_price": 450, "total": 5400},
            {"description": "Granite countertops (45 sq ft)", "category": "Materials", "qty": 45, "unit_price": 85, "total": 3825},
            {"description": "Countertop installation", "category": "Labor", "qty": 1, "unit_price": 1200, "total": 1200},
            {"description": "Plumbing rough-in", "category": "Labor", "qty": 1, "unit_price": 1800, "total": 1800},
            {"description": "Electrical work", "category": "Labor", "qty": 1, "unit_price": 2200, "total": 2200},
            {"description": "Permit fees", "category": "Permits", "qty": 1, "unit_price": 850, "total": 850},
            {"description": "Dumpster rental", "category": "Equipment", "qty": 1, "unit_price": 600, "total": 600},
        ],
        "tax_rate": 8.25,
        "tax": 1664.44,
        "payment_terms": "50% deposit due upon acceptance. 25% due at project midpoint. Remaining 25% due upon completion.",
        "timeline": "Estimated 3-4 weeks from start date. Work hours: Monday-Friday, 8am-5pm.",
        "notes": "Quote includes all materials and labor. Appliances not included. Any changes to scope may affect pricing. Licensed and insured. 2-year warranty on workmanship.",
    },
    {
        "company_name": "Premium Home Solutions",
        "address": "789 Contractor Ave, Suite 200, Builderville, CA 90220",
        "phone": "(555) 987-6543",
        "email": "info@premiumhomesolutions.com",
        "quote_number": "PHS-24-0891",
        "date": "January 18, 2024",
        "valid_until": "February 28, 2024",
        "customer_name": "John Smith",
        "customer_address": "456 Homeowner St, Residential Town, CA 90211",
        "line_items": [
            {"description": "Complete kitchen demolition & disposal", "category": "Labor", "qty": 1, "unit_price": 3200, "total": 3200},
            {"description": "Premium custom cabinets - solid oak", "category": "Materials", "qty": 14, "unit_price": 680, "total": 9520},
            {"description": "Cabinet installation & hardware", "category": "Labor", "qty": 1, "unit_price": 2400, "total": 2400},
            {"description": "Quartz countertops (50 sq ft)", "category": "Materials", "qty": 50, "unit_price": 110, "total": 5500},
            {"description": "Countertop fabrication & install", "category": "Labor", "qty": 1, "unit_price": 1800, "total": 1800},
            {"description": "Full plumbing update", "category": "Labor", "qty": 1, "unit_price": 2800, "total": 2800},
            {"description": "Electrical upgrade (200 amp)", "category": "Labor", "qty": 1, "unit_price": 3500, "total": 3500},
            {"description": "Under-cabinet LED lighting", "category": "Materials", "qty": 1, "unit_price": 850, "total": 850},
            {"description": "Building permits", "category": "Permits", "qty": 1, "unit_price": 950, "total": 950},
            {"description": "Project management fee", "category": "Other", "qty": 1, "unit_price": 1500, "total": 1500},
        ],
        "tax_rate": 8.25,
        "tax": 2661.70,
        "payment_terms": "1/3 deposit upon signing. 1/3 at demolition completion. 1/3 upon final inspection.",
        "timeline": "4-5 weeks estimated completion. Dedicated project manager assigned. Weekend work available upon request (+15%).",
        "notes": "Premium materials and craftsmanship. 5-year warranty on all work. Includes design consultation. Price locked for 60 days. Fully licensed, bonded, and insured.",
    },
    {
        "company_name": "Budget Builders LLC",
        "address": "55 Economy Drive, Affordable City, CA 90215",
        "phone": "(555) 444-3333",
        "email": "budgetbuilders@email.com",
        "quote_number": "BB-2024-203",
        "date": "January 20, 2024",
        "valid_until": "January 30, 2024",
        "customer_name": "John Smith",
        "customer_address": "456 Homeowner St, Residential Town, CA 90211",
        "line_items": [
            {"description": "Kitchen demo", "category": "Labor", "qty": 1, "unit_price": 1800, "total": 1800},
            {"description": "Stock cabinets (10 units)", "category": "Materials", "qty": 10, "unit_price": 220, "total": 2200},
            {"description": "Cabinet install", "category": "Labor", "qty": 1, "unit_price": 1000, "total": 1000},
            {"description": "Laminate countertops (40 sq ft)", "category": "Materials", "qty": 40, "unit_price": 35, "total": 1400},
            {"description": "Counter install", "category": "Labor", "qty": 1, "unit_price": 600, "total": 600},
            {"description": "Basic plumbing hookup", "category": "Labor", "qty": 1, "unit_price": 800, "total": 800},
            {"description": "Electrical (basic)", "category": "Labor", "qty": 1, "unit_price": 1200, "total": 1200},
        ],
        "tax_rate": 8.25,
        "tax": 742.50,
        "payment_terms": "Full payment due upon completion. Cash or check only.",
        "timeline": "2-3 weeks. Schedule subject to availability.",
        "notes": "Basic renovation package. Permits not included - homeowner responsibility. Disposal fees may apply. 90-day warranty on labor.",
    },
]


def main():
    """Generate all sample quote PDFs."""
    output_dir = Path(__file__).parent.parent / "samples"
    output_dir.mkdir(exist_ok=True)

    filenames = [
        "quote_abc_renovations.pdf",
        "quote_premium_home.pdf",
        "quote_budget_builders.pdf",
    ]

    for filename, data in zip(filenames, QUOTES):
        create_quote_pdf(str(output_dir / filename), data)

    print(f"\nCreated {len(filenames)} sample quotes in {output_dir}/")


if __name__ == "__main__":
    main()
