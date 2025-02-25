defmodule ShaderBackend.Router do
  use Plug.Router

  plug Corsica,
    origins: [ "https://invideo-ai.vercel.app",  "http://localhost:3000", "http://localhost:4000", "http://127.0.0.1:3000", "http://127.0.0.1:4000", "*"],  # Allow requests from any origin
    allow_headers: ["content-type"],  # Allow the Content-Type header
    allow_credentials: true  # Allow POST requests
    allow_methods: [:post]     

  plug :match
  plug :dispatch

  get "/api/v1/healthcheck" do
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Jason.encode!(%{status: "ok", timestamp: DateTime.utc_now()}))
  end

  post "/generate-shader" do
    {:ok, body, conn} = Plug.Conn.read_body(conn)
    %{"prompt" => prompt} = Jason.decode!(body)

    api_key = System.get_env("OPENAI_KEY")

    if api_key == "" do
      conn
      |> put_resp_content_type("application/json")
      |> send_resp(500, Jason.encode!(%{error: "OpenAI API key is missing"}))
    else
      case Req.post("https://api.openai.com/v1/chat/completions",
             json: %{
               model: "gpt-3.5-turbo",
               messages: [
                 %{
                   role: "user",
                   content: """
                   Generate a Three JS WebGL 1.0 compatible fragment shader to create: #{prompt}. The vertex shader draws a full-screen quad, so use the fragment shader to produce the visual effect within that quad. Follow these rules:

                   1. Declare `varying vec3 v_position`
                   2. Use `gl_FragColor` for output
                   3. Include `precision highp float`
                   4. Use `u_time` for animations if needed
                   5. The quad covers coordinates from (-1, -1) to (1, 1)

                   Format your response as:

                   // ---FRAGMENT SHADER---
                   precision highp float;
                   varying vec3 v_position;
                   uniform float u_time;
                   (You can add more here if needed, it's example)

                   void main() {
                     // Your code here to create the effect (Be honest)
                   }
                   """
                 }
               ],
               temperature: 0
             },
             headers: [{"Authorization", "Bearer #{api_key}"}]
           ) do
        {:ok, response} ->
          %{"choices" => [%{"message" => %{"content" => shader_code}} | _]} = response.body
          conn
          |> put_resp_content_type("application/json")
          |> send_resp(200, Jason.encode!(%{code: shader_code}))

        {:error, reason} ->
          conn
          |> put_resp_content_type("application/json")
          |> send_resp(500, Jason.encode!(%{error: "Failed to generate shader: #{inspect(reason)}"}))
      end
    end
  end

  match _ do
    send_resp(conn, 404, "Not Found")
  end
end