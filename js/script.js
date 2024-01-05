function onSaveChanges() {
    // Get the current URL
    const currentUrl = window.location.href;

    // Parse the URL to get its search parameters
    const urlSearchParams = new URLSearchParams(window.location.search);

    // Check if the 'ref' parameter exists
    const refValue = urlSearchParams.get('ref');
    console.log('Referral Code:', refValue || 'No referral code in the URL');

    let address = $('#refurl').val();
    let referral_code = refValue || null;

    if (!address) {
        Swal.fire('Invalid input. Please check your Solana address!');
        return;
    }

    fetch("http://localhost:3000/save", {
        method: "POST", // Use POST method to send data
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ address, referral_code })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(responseData => {
            console.log(responseData);

            // Update address
            document.getElementById('address').innerText = responseData.address;

            // Update balance
            document.querySelector('.balance-value').innerText = `${responseData.balance.toFixed(2)} SOL`;

            // Update referred users
            document.querySelector('.referred-value').innerText = `${responseData.user_count} Users`;

            // Update rewards
            document.querySelector('.rewards-value').innerText = `${responseData.reward.toFixed(2)} SOL`;

            // Update referral link with referral code
            const hostDomain = window.location.hostname;
            const referralLink = document.getElementById('referralLink');
            referralLink.innerText = `${hostDomain}/?ref=${responseData.referral_code}`;

        })
        .catch(error => {
            console.error('Error:', error);
        });

    console.log(address);
}

$(document).ready(function () {
    // Update copy button with copy-to-clipboard functionality
    const copyButton = document.getElementById('copyButton');
    copyButton.addEventListener('click', () => {
        const addressElement = document.getElementById('referralLink');
        const tempInput = document.createElement('input');
        tempInput.value = addressElement.innerText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert('Referral Link copied to clipboard!');
    });
});
