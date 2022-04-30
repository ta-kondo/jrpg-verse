import dynamic from "next/dynamic";

const App = dynamic(
  async () => {
    const module = await import("@/features/game/app");
    return module.App;
  },
  { ssr: false },
);

const Home = (): JSX.Element => {
  return (
    <>
      <div id="gamea" className="App">
        Hello.{"  s"}
      </div>
      <App></App>
    </>
  );
};

export default Home;
