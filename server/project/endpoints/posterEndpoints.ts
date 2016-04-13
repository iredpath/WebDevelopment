import * as http from 'http'
import * as fs from 'fs'

export default function(app) {

	app.get('/api/project/poster/:id', (req, res) => {
		const id = req.params.id
		const API_KEY = process.env.OMDB_KEY

		const options = {
			hostname: "img.omdbapi.com",
			path: `/?i=${id}&apikey=${API_KEY}`,
			method: 'POST'
		}
		let img = ''
		console.log(options.path)

		/**
		 * option 1: store the image directly in the server
		 * may not be permitted by openshift
		 **/
		let request = http.request(options, (resp) => {
			resp.setEncoding('binary')
			resp.on('data', chunk => {
				img += chunk
			})
			resp.on('end', () => {
				fs.writeFile(`public/project/assets/posters/${id}.png`, img, 'binary', err => {
					if (err) {
						res.status(400).send(err)
					} else {
						res.status(200).send({ location: `public/project/assets/posters/${id}.png` })
					}
				})
			})
		})
		
		/**/
/**
		let request = http.request(options, resp => {
			resp.setEncoding('base64')
			resp.on('data', chunk => {
				img += chunk
			})
			resp.on('end', () => {
				res.status(200).send(img)
			})
		})

		request.write("")
		request.end()
**/
	})

}