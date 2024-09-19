const Button = ({ onClick, buttonText }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-[#78A8EB] text-black py-2 rounded-lg hover:bg-blue-400 "
    >
      {buttonText}
    </button>
  );
};

export default Button;
