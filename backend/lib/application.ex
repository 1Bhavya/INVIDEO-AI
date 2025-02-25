defmodule ShaderBackend.Application do
  use Application

  def start(_type, _args) do
    children = [
      {Plug.Cowboy, scheme: :http, plug: ShaderBackend.Router, options: [port: 4000]},
      {ShaderBackend.HealthCheck, []} # Start HealthCheck GenServer
    ]

    opts = [strategy: :one_for_one, name: ShaderBackend.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
