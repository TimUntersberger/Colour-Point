$(() => {
    $.ajax({
        url: "/api/materials",
        method: "get",
        data: {
            id: 0
        },
        success: ({ materials }) => {
            materials.forEach(material => {
                if (material.quantity >= material.minquantity) return;
                const $row = $(".material.template")
                    .clone()
                    .removeClass("template")
                    .attr("id", material.id);
                $row.addClass("negative");
                $row.find(".materialName").text(material.name);
                $row.find(".materialFormat").text(material.format);
                $row.find(".materialMinQuantity").text(material.minquantity);
                $row.find(".materialQuantity i").remove();
                $row
                    .find(".materialQuantity .quantityValue")
                    .text(material.quantity);
                $("#materials").append($row);
            });
        }
    });
    const socket = window.socket;
    socket.on("delete material", material => {
        $("#" + material.id + ".material").remove();
    });
    socket.on("update material", material => {
        if (material.quantity) {
            const $quantity = $(
                "#" + material.id + ".material .materialQuantity .quantityValue"
            );
            $quantity.text(
                parseInt($quantity.text()) + parseInt(material.quantity)
            );
            if (
                $quantity.text() >=
                $("#" + material.id + ".material .materialMinQuantity").text()
            )
                $("#" + material.id + ".material").remove();
        }
        if (material.name)
            $("#" + material.id + ".material .materialName").text(
                material.name
            );

        if (material.format)
            $("#" + material.id + ".material .materialFormat").text(
                material.format
            );

        if (material.minquantity) {
            $("#" + material.id + ".material .materialMinQuantity").text(
                material.minquantity
            );
            if (
                $(
                    "#" +
                        material.id +
                        ".material .materialQuantity .quantityValue"
                ).text() >=
                $("#" + material.id + ".material .materialMinQuantity").text()
            )
                $("#" + material.id + ".material").remove();
        }
    });
});
