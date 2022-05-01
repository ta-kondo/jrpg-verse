import dynamic from "next/dynamic";

const GameScreen = dynamic(
  async () => {
    const module = await import("@/features/game/app");
    return module.GameScreen;
  },
  { ssr: false },
);

const Screen: () => JSX.Element = () => {
  return <GameScreen />;
};

export default Screen;
