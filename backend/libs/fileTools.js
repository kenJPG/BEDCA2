/*
=======================
This file contains functions are related to manipulating and reading files/images.

Class: DAAA/FT/1B/04
Name: Kenneth Chen
Student ID: P2100072
=======================
*/


const mime = require('mime-kind'); //mime kind will be used to determine the mimetype of a buffer
const fs = require('fs');
const path = require('path');

// ==== Config ====
const maxFileSize = 999999 // Maximum acceptable file size in bytes (inclusive).

const defaultDestination = './uploads' // The default destination the images should be saved in.

const defaultFileExt = 'png'; // Default extension of an image
// ================

const BadFileTypeError = require('../errors/badFileType.js')
const BadRequestError = require('../errors/badRequest.js')
const FileTooLargeError = require('../errors/fileTooLarge.js')

// Validates the file type under the following conditions:
// 	 - the mimetype must be either png or jpeg;
// 	 - the size must be less than maxFileSize(specified above)
const validateFile = async function(file) {
	console.log(`[fileTools.js] Validating file ${file.originalname}`);

	let mimetype = await mime.async(file.buffer);
	if (mimetype == null) {
		throw new BadFileTypeError()
	}

	let fileSize = file.size;

	if (fileSize <= maxFileSize) {

		// Only accepting mimetypes of png or jpeg
		// NOTE: jpg and jpeg are the same, apart from the spelling. https://www.javatpoint.com/jpeg-vs-jpg
		// As such, they have the same mimetypes. The mimetype for both is 'image/jpeg'.
		console.log("mimetype:",mimetype.mime)
		if ((mimetype.mime == 'image/png' || mimetype.mime == 'image/jpeg')) {
			console.log(`[fileTools.js] File is valid`);
			return mimetype;
		} else {
			throw new BadFileTypeError()
		}
	} else {
		throw new FileTooLargeError()
	}
}

// Save the image file 
const downloadFile = async function(options = {file, name: "", ext: defaultFileExt, dest: defaultDestination, accessDest: defaultDestination}) {
	let {file, name, ext, dest, accessDest} = options;
	console.log(`[fileTools.js] Downloading file ${file.originalname}`);

	// If there is no filename specified, we will use the original name of the file
	if (!name) name = file.originalname;

	name = addExtension(name, ext);

	console.log("[fileTools.js] SAVING TO ",path.resolve(dest, name))
	
	await fs.promises.writeFile(
		path.resolve(dest, name),
		file.buffer);

	// NOTE: we are not using path.resolve and instead are using path.join.
	// join retains the relative path whereas resolve would have changed
	// it into an absolute path. A relative path is used as it does not
	// break when trying to move to a new directory. Additionally, accessDest
	// is where the image can be accessed and will be used instead. This is because
	// if dest uses '..' to go to parent directories, it will resolve into an absolute
	// path, which makes it impossible for users to access.
	return path.join(accessDest, name);
}
	
// Given the filename and the file extension,
// this function returns the filename with the
// file extension appended to it.
const addExtension = function(fileName, fileExt) {
	let splitArr = fileName.split('.')
	if (splitArr.length > 1) {
		if (splitArr[splitArr.length - 1] == fileExt) {
			return splitArr.join('.');
		} else {
			return splitArr.join('.') + '.' + fileExt;
		}
	} else {
		return splitArr.join('.') + '.' + fileExt;
	}
}

// Given a list of objects that contain image urls, change it
// to a list consisting of their respective buffers
//	  [
//		 {"imageURL": <image_1 url>},
//		 {"imageURL": <image_2 url>},
//		 {"imageURL": <image_3 url>},
//		  ...
//    ]
//
// to
//
//	  [
// 		 <Buffer of image_1>,
//		 <Buffer of image_2>,
//       <Buffer of image_3>,
//       ...
//    ]
const getBufferFromResultArray = function(imageResultArray) {
	
	// Returns an array of promises that resolve the respective image buffers
	return Promise.all(
		imageResultArray.map(
			async(imageObject) => {
				// Return the buffer of each image, given the url
				return await fs.promises.readFile(imageObject['imageURL']);
			}
		)
	)
}

// Given a list of objects that contain image urls,
// Return HTML img elements that displays all the images.
// This is done by retrieving the buffers and storing them in <img src=''>
//	  [
//		 {"imageURL": <image url 1>},
//		 {"imageURL": <image url 2>},
//		 {"imageURL": <image url 3>},
//		  ...
//    ]
//
// to
//
//    [
//		 "image_1",
//		 "image_2",
//		 "image_3",
//        ...
//    ]
const generateImageHTML = async function(imageResultArray) {

	// Get the image buffers
	let bufferArray = await getBufferFromResultArray(imageResultArray);

	// Generate an array that contains all the HTML img elements
	let htmlArray = await Promise.all(
		bufferArray.map(
			async(buffer) => {

				// Get the mimetype of the buffer
				let mimetype = await mime.async(buffer);
				return `data:${mimetype.mime};base64,${buffer.toString('base64')}`;
			}
		)
	)

	// Return a string where the HTML img elements are separated by newline '\n'
	return htmlArray.join('\n');
}


// This function allows for access to files(images) stored in the backend
const getImageB64 = async function(imagename) {
	// Check if the imagename is correct
	if (!imagename.startsWith('assets\\img\\')) {
		throw new BadRequestError("Invalid image name format")
	}

	return await generateImageHTML([{imageURL: imagename}])
}

const deleteImage = async function(dest, imageURL) {
	console.log("Deleting", path.resolve(dest, imageURL))
	await fs.promises.unlink(path.resolve(dest, imageURL))
}

module.exports = {validateFile, downloadFile, generateImageHTML, deleteImage, getImageB64}