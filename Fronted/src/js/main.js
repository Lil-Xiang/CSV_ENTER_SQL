import "../scss/style.scss";
require('dotenv').config();

$(document).ready(function () {
  let userData = null;
  let productData = null;
  //選擇使用者檔案Input
  $("#user-file").on("change", function (event) {
    preloadData(event, function (data) {
      userData = data;
      console.log("User data preloaded:", userData);
    });
  });
  //選擇商品檔案Input
  $("#product-file").on("change", function (event) {
    preloadData(event, function (data) {
      productData = data;
      console.log("Product data preloaded:", productData);
    });
  });
  //送使用者檔案給後端Button
  $("#send-user").on("click", function (event) {
    if (userData) {
      sendUserData(userData);
    } else {
      console.error("No user data preloaded.");
    }
  });
  //送商品檔案給後端Button
  $("#send-product").on("click", function (event) {
    if (productData) {
      sendProductData(productData);
    } else {
      console.error("No product data preloaded.");
    }
  });
  //獲取使用者資料Button
  $("#get-user").on("click", function (event) {
    getUserData();
  });
  //獲取商品資料Button
  $("#get-product").on("click", function (event) {
    getProductData();
  });

  const userTable = $("#user-table tbody"); // 修改這裡
  const productTable = $("#product-table tbody"); // 修改這裡

  // 寫使用者資料進table
  function fillTableWithUserData(data) {
    userTable.empty(); // 清空表格內容

    data.forEach(function (user, index) {
      const row = 
        `<tr>
          <th scope="row">${index + 1}</th>
          <td>${user.USER_ID}</td>
          <td>${user.PASSWORD}</td>
        </tr>`;
        userTable.append(row);
    });
  }
  // 寫商品資料進table
  function fillTableWithProductData(data) {
    productTable.empty(); // 清空表格內容
    data.forEach(function (product, index) {
      const row = 
        `<tr>
          <th scope="row">${index + 1}</th>
          <td>${product.ITEM_ID}</td>
          <td>${product.ITEM_MODEL}</td>
          <td>${product.ITEM_DESC}</td>
          <td>${product.ITEM_CATA}</td>
          <td>${product.ITEM_PRICE}</td>
        </tr>`;
        productTable.append(row);
    });
  }

  //獲得CSV檔案
  function preloadData(event, callback) {
    const file = event.target.files[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const contents = e.target.result;
      const data = parseCSV(contents);
      // console.log(data);
      callback(data);
    };
    reader.readAsText(file, "Big5");
  }

  //整理CSV格式
  function parseCSV(csvData) {
    const lines = csvData.split("\n"); //先換行整理成陣列
    const headers = lines[0].split(","); //把table標頭拿出來
    const data = [];

    for (let i = 1; i < lines.length - 1; i++) {
      //整理table內容
      const currentLine = lines[i].split(",");
      if (currentLine.length === headers.length) {
        const entry = {};
        for (let j = 0; j < headers.length; j++) {
          entry[headers[j].trim()] = currentLine[j].trim();
        }
        data.push(entry);
      }
    }
    return data;
  }

  //傳送使用者資料
  function sendUserData(data) {
    $.ajax({
      type: "POST",
      url: process.env.UPDATE_USER_URL,
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (response) {
        console.log("Data sent to backend successfully:", response);
      },
      error: function (xhr, status, error) {
        console.error("Failed to send data to backend:", error);
      },
    });
  }

  //傳送商品資料
  function sendProductData(data) {
    console.log(data);
    $.ajax({
      type: "POST",
      url: process.env.UPDATE_ITEMS_URL,
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (response) {
        console.log("Data sent to backend successfully:", response);
      },
      error: function (xhr, status, error) {
        console.error("Failed to send data to backend:", error);
      },
    });
  }
  //獲得使用者資料
  function getUserData(params) {
    $.ajax({
      type: "GET",
      url: process.env.GET_USER_URL,
      dataType: "json",
      success: function (response) {
        fillTableWithUserData(response); // 在成功回調中填充表格
      },
      error: function (xhr, status, error) {
        errorCallback(error);
      },
    });
  }
  //獲得商品資料
  function getProductData(params) {
    $.ajax({
      type: "GET",
      url: process.env.GET_ITEMS_URL,
      dataType: "json",
      success: function (response) {
        fillTableWithProductData(response)
      },
      error: function (xhr, status, error) {
        errorCallback(error);
      },
    });
  }
});
