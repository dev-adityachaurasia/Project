import tick from "../../assets/check-mark.png";

const Tick = () => {
  return (
    <img
      className={`absolute bg-green-300 rounded-lg flex justify-center items-center right-2 top-3`}
      width="15px"
      src={`${tick}`}
      alt=""
    />
  );
};

export default Tick;
