class CQuery
{
  constructor ( )
  {
    this.goal = 0;
    this.total = 0;
  }
  getGoal ( )
  {
    return this.goal;
  }
  setGoal ( iGoal )
  {
    this.goal = iGoal;
  }
  getTotal ( )
  {
    return this.total;
  }
  setTotal ( iTotal )
  {
    this.total = iTotal;
  }
};
objQuery = new CQuery ( );
function displayProgress ( iProteins )
{
    chrome.storage.sync.get
    (
      objQuery,
      function ( objItems )
      {
        objQuery.setGoal ( objItems.goal );
        var bNoError = true;
        var objElem = null;
        if ( chrome.runtime.error )
        {
          bNoError = false;
        }
        if ( true == bNoError )
        {
          objElem = document.getElementById ( "proteinIntake" );
        }
        if ( typeof ( objElem ) === typeof ( undefined ) )
        {
          bNoError = false;
        }
        if ( ( true == bNoError ) && ( null === objElem ) )
        {
          bNoError = false;
        }
        if ( true == bNoError )
        {
          var iCurrentGoal = 0;
          iCurrentGoal = parseInt ( objQuery.getGoal ( ) );
          if ( true == checkGoal ( objElem, iCurrentGoal ) )
          {
            console.log ( "CurrentGoal: " + iCurrentGoal );
            updateProgress ( objElem, iProteins, iCurrentGoal );
          }
        }
      }
    );
}
function checkGoal ( oProteinIntakeElem, iCurrentGoal )
{
  var bHasAGoal = true;
  if ( 0 >= iCurrentGoal )
  {
    /*
    * \desc Check the goal, if the goal
    *       is smaller the 0 then do not update
    *       otherwise do it.
    */
    oProteinIntakeElem.style.width = 0 + '%';
    $("#progressComplete").text ( oProteinIntakeElem.style.width );
    bHasAGoal = false;
  }
  return bHasAGoal;
}
function updateProgress ( oProteinIntakeElem, iProteins, iCurrentGoal )
{
  var iIntake = computeProgress ( iProteins, iCurrentGoal );
  if ( 100 > iIntake )
  {
    /*
    * \desc Use the number of proteins
            to increase the progress.
    */
    oProteinIntakeElem.style.width = iIntake + '%';
    $("#progressComplete").text ( oProteinIntakeElem.style.width );
  }
  else
  {
    /*
    * \desc Stop changing the width, maybe show
    *       a message on the progress bar.
    */
    oProteinIntakeElem.style.width = "100%";
    $('#progressComplete').text("Complete");
  }
}
function computeProgress ( iAmount, iGoal )
{
  /*
  * \desc How much from the 100% progress has been made.
  */
  var iProgress = 0;
  if ( 0 != iGoal )
  {
    iProgress = ( parseInt(iAmount) * 100 )/ parseInt ( iGoal );
  }
  return iProgress;
}
function resetProgress ( )
{
  /*
  * \desc Reset the progress bar
  */
  var objElem = document.getElementById ( "proteinIntake" );
  var iWidth = 0;
  objElem.style.width = iWidth + '%';
  /*
  * \desc Reset the text which says that the progress is complete.
  */
  $('#proteinIntake').text("");
}

/*
* \desc Register a handler for extension onLoad, to re-initialize with
*       the state from storage the extension page.
*/
$( function ( )
{
  chrome.storage.sync.get
  (
    objQuery,
    function ( objItems )
    {
      var bHasError = false;
      var objElem   = null;
      if ( chrome.runtime.lastError )
      {
        bHasError = true;
      }
      if ( false == bHasError )
      {
        objElem = document.getElementById ( "proteinIntake" );
      }
      if ( null === objElem )
      {
        bHasError = true;
      }
      if ( null == objItems.total )
      {
        bHasError = true;
      }
      if ( null == objItems.goal )
      {
        bHasError = true;
      }
      if ( false == bHasError )
      {
        objQuery.setTotal ( objItems.total );
        objQuery.setGoal  ( objItems.goal );
        elemPBar = document.getElementById ( "progressBar" )
        if ( 0 < objQuery.getGoal ( ) )
        {
          /*
          * \desc Only if the goal is set and is
                  reacheable unhide the bar start progressing.
          */
          elemPBar.style.visibility = "visible";
          updateProgress
          (
            objElem,
            objQuery.getTotal ( ),
            objQuery.getGoal ( )
          );
        }
        else
        {
          elemPBar.style.visibility = "hidden";
        }
      }
      else
      {
        console.error ( "Error: @popup progress loader!" );
      }
    }
  )
});
/*
* \desc Register handler for storage changes
*/
function addStorageChangeListener ()
{
  if (typeof(chrome.storage) === typeof(undefined))
  {
    console.log("Chrome Storage is undefined!");
  }
  else
  {
    /*
    * \desc Add a handler for storage change events.
    */
    chrome.storage.onChanged.addListener (
    function ( objChanges, strNs )
    {
      if ( typeof ( objChanges.total ) !== typeof ( undefined )  )
      {
        if ( objChanges.total != null )
        {
          /*
          * \desc Just send the value of the key to the handler
          */
          displayProgress ( objChanges.total.newValue );
        }
        else
        {
            console.log ( "objChanges is null!" );
        }
      }
      else
      {
        console.log ( "objChanges is undefined!" )
      }
      if ( typeof ( objChanges.goal ) !== typeof ( undefined ) )
      {
        if ( objChanges.goal != null )
        {
          /*
          * \desc If a new goal has been set rest the bar.
          */
          resetProgress ( );
        }
        else
        {
          console.log ( "objChanges.goal is null" );
        }
      }
      else
      {
        console.log ( "objChanges.goal is undefined!" );
      }
    });
  }
}
/*
* \desc Start listening for storage events
*/
addStorageChangeListener ( );
