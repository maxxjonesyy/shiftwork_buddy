import closeIcon from "../assets/icons/close-icon.svg";

function Modal(props) {
  if (!props.showModal) return null;

  addEventListener("click", (e) => {
    if (e.target.id === "overlay") {
      props.setShowModal(false);
    }
  });

  return (
    <>
      <div
        id='overlay'
        className='fixed top-0 left-0 w-full h-full bg-black opacity-80 z-[1]'></div>
      <aside className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[700px] h-autos max-h-[700px] bg-backgroundWhite z-[2] rounded-md p-5 overflow-scroll'>
        <header className='flex justify-between items-center'>
          <h1 className='text-xl font-semibold'>{props.title}</h1>
          <img
            src={closeIcon}
            alt='close modal'
            className='hover:cursor-pointer'
            onClick={() => props.setShowModal(false)}
          />
        </header>
        <div className='mt-10'>{props.component}</div>
      </aside>
    </>
  );
}

export default Modal;
