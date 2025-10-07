export default function Footer() {
  return (
    <footer className="border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 md:order-2">
            <a className="text-sm text-slate-600 hover:text-blue-600 transition-colors" href="#contact">
              Contact Us
            </a>
            <a className="text-sm text-slate-600 hover:text-blue-600 transition-colors" href="#">
              Terms of Service
            </a>
            <a className="text-sm text-slate-600 hover:text-blue-600 transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="text-sm text-slate-600 hover:text-blue-600 transition-colors" href="#">
              Integrations
            </a>
          </div>
          <p className="text-sm text-slate-600 md:order-1">
            © 2023 SmartContent AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
