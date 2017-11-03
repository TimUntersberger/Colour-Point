$(() => {
    getCategories(({ categories }) => {
        categories.forEach(category => {
            addCategory(category.name, category.id);
        });
    });
    const socket = window.socket;
    socket.on("new category", category => {
        addCategory(category.name, category.id);
    });
    socket.on("delete category", category => {
        deleteCategory(category.id);
    });
    socket.on("update categories", category => {
        if (category.name) {
            $("#" + category.id + ".item.category .categoryName").text(
                category.name
            );
            const settingsModal = $("#settingsModal");
            if (
                settingsModal.modal("is visible") &&
                settingsModal.currentCategory == category.id
            ) {
                $("#categoryNameSetting").val(category.name);
            }
        }
    });
    socket.on("new material", material => {
        if ($(".item.category.active").attr("id") == material.categorie_id)
            addMaterial(material);
    });
    socket.on("delete material", material => {
        if ($(".item.category.active").attr("id") == material.categorie_id)
            deleteMaterial(material.id);
    });
    socket.on("update material", material => {
        if ($(".item.category.active").attr("id") == material.categorie_id) {
            if (material.quantity) {
                const $quantity = $(
                    "#" +
                        material.id +
                        ".material .materialQuantity .quantityValue"
                );
                $quantity.text(
                    parseInt($quantity.text()) + parseInt(material.quantity)
                );
                if (
                    $quantity.text() >=
                    $(
                        "#" + material.id + ".material .materialMinQuantity"
                    ).text()
                )
                    $("#" + material.id + ".material").removeClass("negative");
                else $("#" + material.id + ".material").addClass("negative");
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
                    ).text() <
                    $(
                        "#" + material.id + ".material .materialMinQuantity"
                    ).text()
                )
                    $("#" + material.id + ".material").addClass("negative");
                else $("#" + material.id + ".material").removeClass("negative");
            }
        }
    });
});
const sortMaterials = column => {
    if ($(".category.active").length == 0) return;
    const columns = {
        materialName: 0,
        materialFormat: 1
    };
    const columnIndex = columns[column];
    const materials = $("#materials");
    const rows = materials.children("tr").not(".template");
    rows.sort((x, y) => {
        return x.children[columnIndex].children[0].innerText.localeCompare(
            y.children[columnIndex].children[0].innerText
        );
    });
    materials.html("");
    rows.each((i, ele) => materials.append(ele));
};
const deleteMaterial = id => {
    $("#materials #" + id).remove();
};
const deleteCategory = id => {
    $("#categories #" + id).remove();
    $("#materials").html("");
};
const getCategories = cb => {
    $.ajax({
        url: "/api/categories",
        method: "get",
        success: cb
    });
};
const onDeleteMaterial = event => {
    $("#deleteConfirm")
        .modal({
            onApprove: () => {
                $.ajax({
                    url:
                        "/api/materials/" +
                        event.target.parentNode.parentNode.id,
                    method: "delete",
                    data: {
                        categorie_id: $(".item.category.active").attr("id")
                    }
                });
            }
        })
        .modal("show");
};
const updateQuantity = val => {
    const id = $(".material.used").attr("id");
    $.ajax({
        url: "/api/materials/" + id,
        method: "patch",
        data: {
            quantity: val,
            id: id,
            categorie_id: $(".item.category.active").attr("id")
        }
    });
};
const onAmountWillChange = event => {
    if (event.keyCode == 13) {
        updateQuantity(
            event.target.id == "amountToAdd"
                ? event.target.value
                : -event.target.value
        );
        const $popup = $(
            event.target.id == "amountToAdd"
                ? ".material.used td .addQuantity"
                : ".material.used td .subtractQuantity"
        );
        $popup.popup("hide");
    }
};
const changeActiveMaterial = event => {
    $(event.target.parentNode.parentNode)
        .addClass("used")
        .siblings()
        .removeClass("used");
};
const onMaterialFormatWillChange = event => {
    if (event.keyCode == 13) {
        event.preventDefault();
        event.target.blur();
    }
};
const onMaterialNameWillChange = event => {
    if (event.keyCode == 13 && !event.shiftKey) {
        event.preventDefault();
        event.target.blur();
    }
};
const addMaterial = material => {
    const $row = $(".material.template")
        .clone()
        .removeClass("template")
        .attr("id", material.id);
    if (material.quantity < material.minquantity) $row.addClass("negative");
    $row.find(".materialName").text(material.name);
    $row.find(".materialFormat").text(material.format);
    $row.find(".materialMinQuantity").text(material.minquantity);
    $row.find(".materialQuantity .quantityValue").text(material.quantity);
    $row.find(".materialQuantity .materialMinus").popup({
        popup: $(".ui.popup.subtractQuantityPopup"),
        on: "click",
        onVisible: () => $(".ui.popup.subtractQuantityPopup input").focus(),
        onHidden: () => $(".ui.popup.subtractQuantityPopup input").val("")
    });
    $row.find(".materialQuantity .materialPlus").popup({
        popup: $(".ui.popup.addQuantityPopup"),
        on: "click",
        onVisible: () => $(".ui.popup.addQuantityPopup input").focus(),
        onHidden: () => $(".ui.popup.addQuantityPopup input").val("")
    });
    $("#materials").append($row);
};
const onAddMaterial = event => {
    const id = $(".item.category.active").attr("id");
    $.ajax({
        url: "/api/materials",
        method: "post",
        data: {
            id: id
        }
    });
};
const onFocusCategorySetting = event =>
    (event.target.initialValue = event.target.value);

const onSaveCategorySetting = () => {
    const categoryNameSetting = $("#categoryNameSetting");
    if (categoryNameSetting[0].initialValue !== categoryNameSetting.val()) {
        $.ajax({
            url: "/api/categories/" + $("#settingsModal")[0].currentCategory,
            method: "patch",
            data: {
                name: categoryNameSetting.val()
            }
        });
    }
    $("#settingsModal").modal("hide");
};
const onMaterialMinQuantityWillChange = event => {
    if (event.keyCode == 13) {
        event.preventDefault();
        if (!isNaN(event.target.innerText) && event.target.innerText >= 0)
            event.target.blur();
    }
};
const handleCategorySelection = category => {
    $.ajax({
        url: "/api/materials/",
        method: "get",
        data: {
            id: category.id
        },
        success: ({ materials }) => {
            $(category)
                .addClass("active")
                .siblings()
                .removeClass("active");
            $("#materials tr")
                .not(".template")
                .remove();
            materials.forEach(addMaterial);
        }
    });
};

const onBlurMaterial = event => {
    toggleContentEditable(event);
    const parentNode =
        event.target.nodeName === "PRE"
            ? event.target.parentNode.parentNode
            : event.target.parentNode;
    $(parentNode)
        .addClass("used")
        .siblings()
        .removeClass("used");
    const id = parentNode.id;
    const props = {};
    if (event.target.classList.contains("materialName"))
        props.name =
            event.target.innerText == "\n" || event.target.innerText == ""
                ? "Name"
                : event.target.innerText;
    if (event.target.classList.contains("materialFormat"))
        props.format =
            event.target.innerText == "\n" || event.target.innerText == ""
                ? "Format"
                : event.target.innerText;
    if (event.target.classList.contains("materialMinQuantity"))
        props.minquantity =
            event.target.innerText == "\n" || event.target.innerText == ""
                ? 0
                : event.target.innerText;
    $.ajax({
        url: "/api/materials/" + id,
        method: "patch",
        data: {
            id: id,
            categorie_id: $(".category.active").attr("id"),
            ...props
        }
    });
};

const onCategorySelected = event => {
    handleCategorySelection(event.target.parentNode);
    event.stopPropagation();
};

const onCategoryMenuItemSelected = event => {
    handleCategorySelection(event.target);
};
const onBlurCategorySetting = event => {};
const onRemoveCategory = event => {
    $("#deleteConfirm")
        .modal({
            onApprove: () => {
                $.ajax({
                    url: "/api/categories/" + event.target.parentNode.id,
                    method: "delete"
                });
            }
        })
        .modal("show");
    event.stopPropagation();
};
const toggleContentEditable = event => {
    const ele = event.target;
    ele.contentEditable = !(ele.contentEditable === "true");
    if (ele.contentEditable === "true") {
        ele.focus();
        window.getSelection().selectAllChildren(ele);
    }
};
const onShowSettings = () => {};

const onConfigureCategory = event => {
    const category = event.target.parentNode;
    $("#categoryNameSetting").val(
        category.querySelector(".categoryName").innerText
    );
    $("#settingsModal")
        .modal({
            onShow: onShowSettings
        })
        .modal("show");
    $("#settingsModal")[0].currentCategory = category.id;
    event.stopPropagation();
};

const onCategoryNameWillChange = event => {
    if (event.keyCode == 13) {
        event.preventDefault();
        onSaveCategorySetting();
    }
};
const onAddCategory = event => {
    const defaultName = "Unbekannt";
    $.ajax({
        url: "/api/categories",
        method: "post",
        data: {
            name: defaultName
        }
    });
};
const addCategory = (name, id) => {
    let $category = $(".category.template")
        .clone()
        .removeClass("template")
        .attr("id", id);
    $category.find(".categoryName").text(name);
    $("#categories").append($category);
};
