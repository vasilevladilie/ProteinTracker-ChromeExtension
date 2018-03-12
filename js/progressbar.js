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
          var iWidth  = 1;
          var iCurrentGoal = 0;
          iCurrentGoal = parseInt ( objQuery.getGoal ( ) );
          var iIntake = computeProgress ( iProteins, iCurrentGoal );
          if ( 100 > iWidth )
          {
            /*
            * \desc Use the number of proteins
                    to increase the progress.
            */
            iWidth = iIntake;
            objElem.style.width = iWidth + '%';
            $("#progressComplete").text ( objElem.style.width );
          }
          if ( 100 <= iWidth )
          {
            /*
            * \desc Stop changing the width, maybe show
            *       a message on the progress bar.
            */
            $('#progressComplete').text("Complete");
          }
        }
      }
    );
}
function computeProgress ( iAmount, iGoal )
{
  /*
  * \desc How much from the 100% progress has been made.
  */
  var iProgress = 0;
  iProgress = ( parseInt(iAmount) * 100 )/ parseInt ( iGoal );
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
      var oProteinIntakeElem = null;
      if ( chrome.runtime.lastError )
      {
        bHasError = true;
      }
      if ( false == bHasError )
      {
        oProteinIntakeElem = document.getElementById ( "proteinIntake" );
      }
      if ( null === oProteinIntakeElem )
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
        var iIntake = computeProgress
        (
          objQuery.getTotal ( ),
          objQuery.getGoal ( )
        );
        if ( 100 >= iIntake )
        {
          oProteinIntakeElem.style.width = iIntake + '%';
          $("#progressComplete").text ( oProteinIntakeElem.style.width );
        }
        else
        {
          oProteinIntakeElem.style.width = "100%";

          $("#progressComplete").text ( "Complete" );
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
