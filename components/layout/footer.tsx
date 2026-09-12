// components/layout/footer.tsx
export function Footer() {
  return (
    <footer className="w-full border-t bg-white py-6">
      <p className="text-center text-xs text-gray-500">
        © {new Date().getFullYear()} tentwenty. All rights reserved.
      </p>
    </footer>
  );
}