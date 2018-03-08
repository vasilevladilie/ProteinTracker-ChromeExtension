
const  pr   =   document.getElementById('prompt');
const  p    =   prompt('Enter your name here please: ');
pr.value    =   p;




$(() => {
    chrome.storage.sync.get('goal', (items) => {
        $('#goal').val(items.goal);
    });

    $('#save').click( () => {
        const goal = $('#goal').val();
        if (goal) {
            chrome.storage.sync.set({ 'goal': goal }, () => {
                close();
            });
        }
    });

    $('#reset').click(function () {
        chrome.storage.sync.set({ 'total' : 0, 'goal' : 0 }, () => {
            const opt = {
                type: "basic",
                title: "Total reset!",
                message: "Total & Goal has been reset back to 0!",
                iconUrl: "img/icon2.png"
            }

            chrome.notifications.create('reset', opt,  () => { });
        });
    });
});
