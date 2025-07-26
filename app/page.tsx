export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Focus Timer</h1>
        <p className="text-center text-gray-600 mb-8">
          Welcome to your productivity companion. Start focusing with our Pomodoro timer.
        </p>
        <div className="flex justify-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-center">Timer component will go here</p>
          </div>
        </div>
      </main>
    </div>
  );
}
