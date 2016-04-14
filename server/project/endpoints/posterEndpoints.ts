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

		let request = http.request(options, resp => {
			resp.setEncoding('base64')
			resp.on('data', chunk => {
				img += chunk
			})
			resp.on('end', () => {
				// possible? hack to only include legitimate posters
				// I don't know enough about encoding to know if this is a good practice
				res.status(200).send(img.indexOf("/9j") === 0 ? img : "")
			})
		})
		request.on('error', (err) => { console.log(err) })
		request.write("")
		request.end()
	})

}