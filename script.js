const FOLDER_ID = "1EKAc1k0cj0vV2pwYsBNWB2OZlu9JMiGi"; // Your folder ID

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  var data = JSON.parse(e.postData.contents);

  var date = Utilities.formatDate(new Date(), "Asia/Karachi", "dd-MM-yyyy");
  var time = Utilities.formatDate(new Date(), "Asia/Karachi", "HH:mm:ss");

  // Decode image
  var imgData = data.image.replace(/^data:image\/png;base64,/, "");
  var blob = Utilities.base64Decode(imgData);
  var file = DriveApp.getFolderById(FOLDER_ID)
              .createFile(Utilities.newBlob(blob, "image/png", data.name + "_" + time + ".png"));

  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  var imageURL = "https://drive.google.com/uc?export=view&id=" + file.getId();

  sheet.appendRow([
    data.name,
    data.roll,
    data.className,
    date,
    time,
    `=IMAGE("${imageURL}")`
  ]);

  return ContentService.createTextOutput("Saved").setMimeType(ContentService.MimeType.TEXT);
}
