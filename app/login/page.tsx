// app/login/page.tsx
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main
      className={
        "flex min-h-screen w-full items-center justify-center bg-[#1f1f1f]"
      }
    >
      <div className="mx-auto flex h-screen w-full overflow-hidden bg-white shadow-2xl">
        {/* Left side */}
        <section className="flex w-1/2 items-center px-12">
          <div className="w-full">
            <h1 className="mb-5 text-xl font-semibold text-gray-900">
              Welcome back
            </h1>

            <LoginForm />
          </div>
        </section>

        {/* Right side */}
        <section className="flex w-1/2 items-center bg-[#3765ed] px-12 text-white">
          <div className="max-w-md">
            <h2 className="mb-3 text-3xl font-semibold">ticktock</h2>

            <p className="text-sm leading-6 text-white/80">
              Introducing ticktock, our cutting-edge timesheet web application
              designed to revolutionize how you manage employee work hours. With
              ticktock, you can effortlessly track and monitor employee
              attendance and productivity from anywhere, anytime, using any
              internet-connected device.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
