defmodule ShaderBackend.HealthCheck do
  use GenServer

  @interval 14 * 60 * 1000 # 14 minutes in milliseconds

  def start_link(_) do
    GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
  end

  def init(state) do
    schedule_health_check()
    {:ok, state}
  end

  def handle_info(:health_check, state) do
    perform_health_check()
    schedule_health_check()
    {:noreply, state}
  end

  defp schedule_health_check do
    Process.send_after(self(), :health_check, @interval)
  end

  defp perform_health_check do
    IO.puts("Performing health check at #{DateTime.utc_now()}")
    # Add actual health check logic here if needed
  end
end
