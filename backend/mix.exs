defmodule ShaderBackend.MixProject do
  use Mix.Project

  def project do
    [
      app: :ShaderBackend,
      version: "0.1.0",
      elixir: "~> 1.16",
      start_permanent: Mix.env() == :dev,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
  [
    extra_applications: [:logger],
    mod: {ShaderBackend.Application, []}  # Add this line
  ]
end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
  [
    {:plug, "~> 1.14"},
    {:plug_cowboy, "~> 2.6"},
    {:httpoison, "~> 1.8"},
    {:jason, "~> 1.4"},
    {:req, "~> 0.4"},
    {:corsica, "~> 1.3"}  # Add this line
  ]
end
end
