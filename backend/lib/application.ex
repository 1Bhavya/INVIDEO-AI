defmodule ShaderBackend.Application do
  use Application

  def start(_type, _args) do
    children = [
      {Plug.Cowboy, scheme: :http, plug: ShaderBackend.Router, options: [port: 4000]}
    ]

    opts = [strategy: :one_for_one, name: ShaderBackend.Supervisor]
    Supervisor.start_link(children, opts)

    # Start the health check task
    start_health_check_task()

    {:ok, self()}
  end

  defp start_health_check_task() do
    # Schedule the first health check
    Process.send_after(self(), :health_check, 14 * 60 * 1000)
  end

  def handle_info(:health_check, state) do
    # Perform the health check
    perform_health_check()

    # Schedule the next health check
    Process.send_after(self(), :health_check, 14 * 60 * 1000)

    {:noreply, state}
  end

  defp perform_health_check() do
    # Log or perform any health check logic here
    IO.puts("Performing health check at #{DateTime.utc_now()}")
  end

end