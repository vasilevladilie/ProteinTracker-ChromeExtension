
objFields =
{
  'goal'        : 0,
  'p_name'      : "",
  'p_age'       : 0,
  'p_height'    : 0,
  'p_weight'    : 0,
  'mealsperday' : 0,
  'gender'      : "",
}
$(() => {
    objFields,
    chrome.storage.sync.get
    (
      ( items ) => {
        $('#goal').val(items.goal);
        $('#p_name').val(items.p_name);
        $('#p_age').val(items.p_age);
        $('#p_height').val(items.p_height);
        $('#p_weight').val(items.p_weight);
        $('#mealsperday').val(items.mealsperday);
        $('#genderfemale').prop("checked", false );
        $('#gendermale').prop("checked", false );
        if ( 'female' === items.gender )
        {
          $('#genderfemale').prop("checked", true );
        }
        else if ( 'male' === items.gender )
        {
          $('#gendermale').prop("checked", true );
        }
    });

    $('#save').click( () => {
        const goal = $('#goal').val ( );
        const strName = $('#p_name').val ( );
        const iAge = $('#p_age').val ( );
        const iHeight = $('#p_height').val ( );
        const iWeight = $('#p_weight').val ( );
        const iMealsPerDay = $('#mealsperday').val ( );
        const bGenderMale = $('#gendermale').is(":checked");
        const bGenderFemale = $('#genderfemale').is(":checked");

        if (goal) {
            chrome.storage.sync.set({ 'goal': goal }, () => {
                close();
            });
        }
        if ( null != strName )
        {
            chrome.storage.sync.set({ 'p_name': strName }, () => {
                close();
            });
        }
        if ( null != iAge )
        {
            chrome.storage.sync.set({ 'p_age': iAge }, () => {
                close();
            });
        }
        if ( null != iHeight )
        {
            chrome.storage.sync.set({ 'p_height': iHeight }, () => {
                close();
            });
        }
        if ( null != iWeight )
        {
            chrome.storage.sync.set({ 'p_weight': iWeight }, () => {
                close();
            });
        }
        if ( null != iMealsPerDay )
        {
            chrome.storage.sync.set
            (
              { 'mealsperday': iMealsPerDay },
              () => {
              close();
              }
            );
        }
        var strGender = null;
        if ( true == bGenderMale )
        {
          strGender = "male";
        }
        else if ( true == bGenderFemale )
        {
          strGender = "female";
        }
        if ( null != strGender )
        {
          chrome.storage.sync.set({ 'gender': strGender }, () => { close(); });
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
