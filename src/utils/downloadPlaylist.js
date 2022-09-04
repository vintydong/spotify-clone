const downloadPlaylist = (playlist, songs, format) => {
    const acceptedFormats = ['txt', 'csv'];
    if (!acceptedFormats.includes(format)) {
        console.log('Not accepted file format');
        return null;
    }

    let output = '';

    if (format === 'txt') {
        output = output + playlist.playlistName + '\n\n';
        for (const { track } of songs) {
            output = output + track.name + '\n';
        }
    } else if (format === 'csv') {
        output = output + playlist.playlistName + '\n';
        for (const { track } of songs) {
            output =
                output +
                track.name +
                ',' +
                track.artists[0].name +
                ',' +
                track.album.name +
                ',' +
                track.uri +
                '\n';
        }
    } else {
        return;
    }

    const blob = new Blob([output]);
    const fileDownload = URL.createObjectURL(blob);
    return fileDownload;
};

export default downloadPlaylist;
