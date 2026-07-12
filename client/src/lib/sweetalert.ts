import Swal from 'sweetalert2';

// Create a custom styled toast mixin that matches our portfolio theme
export const showToast = (icon: 'success' | 'error' | 'warning' | 'info', title: string) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    background: '#1e293b', // Slate-800 matching theme surface
    color: '#f1f5f9',      // Light text
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  return Toast.fire({
    icon,
    title,
    customClass: {
      popup: 'rounded-2xl border border-secondary/10 shadow-xl font-sans'
    }
  });
};

// Create a custom styled confirmation modal matching our portfolio style
export const showConfirm = async (title: string, text: string, confirmText: string = 'Yes, delete it!') => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    background: '#1e293b', 
    color: '#f1f5f9',
    customClass: {
      popup: 'rounded-[28px] border border-secondary/10 shadow-2xl p-6 sm:p-8 font-sans',
      title: 'text-xl font-bold text-foreground',
      htmlContainer: 'text-sm text-secondary mt-2',
      confirmButton: 'bg-red-500 hover:bg-red-600 text-white rounded-xl px-5 py-3 font-bold text-sm transition-all focus:outline-none focus:ring-4 focus:ring-red-500/20 cursor-pointer',
      cancelButton: 'bg-secondary/15 hover:bg-secondary/25 text-foreground rounded-xl px-5 py-3 font-bold text-sm transition-all focus:outline-none focus:ring-4 focus:ring-secondary/10 ml-3 cursor-pointer'
    },
    buttonsStyling: false
  });
};
