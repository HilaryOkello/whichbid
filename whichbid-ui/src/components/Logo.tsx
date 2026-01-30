export default function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/logo.jpg"
      alt="WhichBid Logo"
      className={className}
      width={32}
      height={32}
      onError={(e) => {
        console.error('Logo failed to load:', e);
      }}
      onLoad={() => {
        console.log('Logo loaded successfully');
      }}
    />
  );
}