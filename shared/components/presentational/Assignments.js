import React from 'react/lib/React'

const Assignments = ({assignment}) => {
  return (
  <div>
    <p className="list-view__title">New Assignments</p>
    { assignment.size !== 0 ? 
        assignment.entrySeq().reverse().map(([key, value]) => 
        <div key={key}>
        <div className="list-view__item">

           <div className="col_xs_2_5 total_view">
            
            {value.get('open_budget') !== 1 ? 
            <div>
                <span className="view__item">{value.get('Max_Budget')}</span>
                <p className="view-item__caption">Budget</p>
            </div> 
            : 
            <div>
                <span className="view__item">Open</span> 
                <p className="view-item__caption">Budget</p>
            </div>}
            </div>
            <div className="col_xs_10">
            <span className="view__item_name"><a href={'https://expertmile.com/expertfree/#/bidme?project=' + value.get('id')}> {value.get('Title')}</a></span><br />
            <span className="view__item_desription">{value.get('Description')}</span>
            <span className="time_ago">{value.get('Time_Ago')}</span>
            </div>
        </div>
        </div>
     ) : 
     <div className="list-view__item">
          <p className="view__item_name__no">There are currently no new assignments available yet.</p>
    </div>
    }
  </div>
  )
}

export default Assignments;
