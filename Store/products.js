function createProducts(){
    var products = document.getElementsByTagName("products")[0];
    products.innerHTML = `<button
    class="snipcart-add-item"
    data-item-id="1"
    data-item-name="Test Product"
    data-item-price="4.00"
    data-item-weight="200"
    data-item-url="https://interstategamers-439981.netlify.live/store/products.html"
    data-item-description="Description of the product">
    Buy This Product plz
    </button>`;
}