document.querySelectorAll('.btn-edit').forEach(button => {
    button.addEventListener('click', function() {
        // Lấy dữ liệu từ thuộc tính data- của nút được bấm
        const id = this.getAttribute('data-id');
        const name = this.getAttribute('data-name');
        const phone = this.getAttribute('data-phone');
        const address = this.getAttribute('data-address');
        const role = this.getAttribute('data-role');

        document.getElementById('edit_display_name').value = name;
        document.getElementById('edit_phone').value = phone;
        document.getElementById('edit_address').value = address;
        document.getElementById('edit_role').value = role;

        document.getElementById('editUserForm').action = `/admin/users/edit/${id}`;
    });
});

document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const name = this.getAttribute('data-name');

        document.getElementById('delete_user_name').innerText = name;
        // Cập nhật URL xóa: /admin/users/delete/id
        document.getElementById('deleteUserForm').action = `/admin/users/delete/${id}`;
    });
});