



function viewArtist(artistId) {
    // Redirect to the artist details page using the artist's ID
    window.location.href = "/artist/" + artistId;
}
function viewPlaylist(vibe) {
    window.location.href = "/playlist/"+vibe;
}
function viewProfile(ID) {
    window.location.href = "/user/profile";
}
function viewAlbum(ID){
    window.location.href = "/album/"+ID;
}
function viewGenre(ID){
    window.location.href = "/genre/"+ID;
}
