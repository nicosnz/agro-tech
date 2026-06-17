import { RouterProvider } from "react-router"
import { appRouter } from "./providers/appRouter"

function App() {
  return <RouterProvider router={appRouter}/>
}

export default App
