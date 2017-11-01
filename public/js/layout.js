const onMenuItemSelected = event => {
    $(event.target)
        .addClass("active")
        .siblings()
        .removeClass("active");
};

$(() => {
    $(".menu a.item").click(onMenuItemSelected);
    window.socket = io();
});
