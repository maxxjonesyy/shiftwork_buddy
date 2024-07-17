import CollapseIcon from "../assets/icons/collapse-icon.svg";

function HowDoesItWork() {
  const buttonText = [
    "Create your shift",
    "Select the date",
    "Add your hours",
    "Add your rate",
  ];

  return (
    <>
      <section className='flex flex-col items-center w-full gap-5'>
        {buttonText.map((text, index) => (
          <div key={index}>
            <span className='text-white text-sm font-light bg-accentBlue shadow-lg rounded-md w-full max-w-[300px] px-5 py-2.5'>
              {text}
            </span>
            {index !== buttonText.length - 1 && (
              <img
                src={CollapseIcon}
                className='w-4 rotate-[90deg] mx-auto mt-5'
              />
            )}
          </div>
        ))}
      </section>

      <p className='mt-10 text-textSecondary'>
        <span className='font-semibold text-accentBlue'>We do the rest,</span>{" "}
        we’ll store the shift for you to access, edit or delete. Below your
        shifts you will see your income and tax paid, this is calculated from
        all your shifts.
      </p>
    </>
  );
}

export default HowDoesItWork;
