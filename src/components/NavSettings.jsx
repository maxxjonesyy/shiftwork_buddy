function NavSettings(props) {
  return (
    <aside
      className='fixed top-[65px] md:top-[77px] right-0 bg-backgroundWhite shadow-md w-full max-w-[200px] max-h-[200px] rounded-md p-5 z-[2]'
      onMouseEnter={() => props.setShowSettings(true)}
      onMouseLeave={() => props.setShowSettings(false)}>
      <ul className='flex flex-col items-center gap-5'>
        <li>
          <button
            onClick={() => {
              props.setShowSettings(false);
              props.setShowModal(true);
            }}
            className='nav-link'>
            How does it work?
          </button>
        </li>
        <li>
          <button onClick={props.logoutUser} className='nav-link'>
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
}

export default NavSettings;
