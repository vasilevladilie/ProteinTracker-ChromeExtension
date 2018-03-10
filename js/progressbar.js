console.log("Start progress bar js script!");
function displayProgress ( iProteins )
{
  var bNoError = true;
  var objElem = document.getElementById ( "proteinIntake" );
  if ( typeof(objElem) === typeof(undefined) )
  {
    console.log("Error: undefined reference.");
    bNoError = false;
  }
  if ( ( true == bNoError ) && ( null === objElem ) )
  {
    console.log("Error: null reference.");
    bNoError = false;
  }
  if ( true == bNoError )
  {
    var iWidth  = 1;
    var iCurrentGoal = 0;
    chrome.storage.sync.get
    (
      "goal",
      function ( objItems )
      {
        iCurrentGoal = objItems.goal;
      }
    );
    /*
    * \desc Show the intake of protein on the progress bar.
    */
    var strWidth = objElem.style.width.replace(/[^0-9]/g,'');
    iWidth = parseInt ( strWidth );
    if ( 100 > iWidth )
    {
      /*
      * \desc Use the number of proteins
              to increase the progress.
      */
      var iIntake = computeProgress ( iProteins, iCurrentGoal );
      iWidth += iIntake;
      objElem.style.width = iWidth + '%';
    }
    if ( 100 <= iWidth )
    {
      /*
      * \desc Stop changing the width, maybe show
      *       a message on the progress bar.
      */
      $('#proteinIntake').text("FULL");
    }
  }
}
function computeProgress ( iAmount, iGoal )
{
  /*
  * \desc How much from the 100% progress has been made.
  */
  return ( iAmount * iGoal ) % 100;
}
function resetProgress ( )
{
  /*
  * \desc Reset the progress bar
  */
  var objElem = document.getElementById ( "proteinIntake" );
  var iWidth = 1;
  objElem.style.width = iWidth + '%';
  /*
  * \desc Reset the text which says that the progress is complete.
  */
  $('#proteinIntake').text("");
}

function addStorageChangeListener ()
{
  /*
  * \desc Add a handler for storage change events.
  */
  if (typeof(chrome.storage) === typeof(undefined))
  {
    console.log("Chrome Storage is undefined!");
  }
  else
  {

    chrome.storage.onChanged.addListener
    (
      function ( objChanges, namespace )
      {
        if ( objChanges.total )
        {
          /*
          * \desc Just send the value of the key to the handler
          */
          displayProgress ( objChanges.total );
        }
        if ( objChanges.goal )
        {
          /*
          * \desc If a new goal has been set rest the bar.
          */
          resetProgress ( );
        }

      }
    )
  }
}

$(addStorageChangeListener);
/*
* \desc Start listening for storage events
*/
console.log("Added my handler");
