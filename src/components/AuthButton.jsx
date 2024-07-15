import googleIcon from "../assets/icons/google-icon.svg";
import githubIcon from "../assets/icons/github-icon.svg";

function AuthButton(props) {
  return (
    <button
      {...props}
      className='flex items-center justify-center text-sm gap-3 w-full py-2 px-10 rounded-md border border-primaryBlue transition-colors duration-300 hover:border-accentBlue'>
      <img
        src={props.provider === "Google" ? googleIcon : githubIcon}
        alt='google icon'
        className='mr-3 w-6'
      />
      <span>Login with {props.provider}</span>
    </button>
  );
}

export default AuthButton;
