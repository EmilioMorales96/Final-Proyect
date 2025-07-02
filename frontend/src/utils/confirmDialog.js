import Swal from 'sweetalert2';

export function confirmDelete(message = "¿Estás seguro de que deseas eliminar esto?") {
  return Swal.fire({
    title: 'Confirmar eliminación',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => result.isConfirmed);
}