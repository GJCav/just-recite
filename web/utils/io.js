export const read_file = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onerror = (err) => {
            reject(err);
        }

        reader.onload = (event) => {
            console.log("yes ")
            resolve(reader.result)
        }

        reader.readAsText(file, "utf-8");
    })
}

