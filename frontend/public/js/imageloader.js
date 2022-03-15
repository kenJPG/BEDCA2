//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================

async function loadImage(productid) {
	/**
	 * Given the productid, return the src attr of the image,
	 * containing the mimetype and base64 image data.
	 */
	return await axios({
		method: 'get',
		url: `http://localhost:8081/api/product/${productid}/image`,
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		}
	}).then(response => {
		return response.data.image_data
	}).catch(err => {
		// console.log(err)
	})
}

async function loadImageName(name) {
	/**
	 * Given the name of the image stored in the backend, return the src
	 * attr of the image, contaiing the mimetype and base64 image data.
	 */
	return await axios({
		method: 'get',
		url: `http://localhost:8081/api/image/`,
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		},
		params: {
			name: name
		}
	}).then(response => {
		return response.data.image_data
	}).catch(err => {
		// console.log(err);
	})
}