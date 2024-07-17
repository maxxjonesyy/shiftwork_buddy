import Swal from "sweetalert2";

function warningAlert(text, icon, successFunction) {
  Swal.fire({
    text: text,
    icon: icon,
    color: "#4d4d4d",
    showCancelButton: true,
    confirmButtonColor: "#6d66fa",
    cancelButtonColor: "red",
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  }).then((result) => {
    if (result.isConfirmed) {
      successFunction();
    }
  });
}

export default warningAlert;
