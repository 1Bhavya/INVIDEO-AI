defmodule ShaderBackend.HealthCheck do
  use GenServer
  require Logger

  @interval 14 * 60 * 1000 # 14 minutes in milliseconds
  @health_url "https://invideo-ai.onrender.com/health" # Replace with your actual endpoint

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
    case HTTPoison.get(@health_url) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        Logger.info("Health check successful: #{body}")

      {:ok, %HTTPoison.Response{status_code: code}} ->
        Logger.error("Health check failed with status: #{code}")

      {:error, %HTTPoison.Error{reason: reason}} ->
        Logger.error("Health check error: #{inspect(reason)}")
    end
  end
end
