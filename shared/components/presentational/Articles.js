import React from 'react/lib/React'

const Articles = ({article}) => {
  return (
  <div>
    <p className="list-view__title">Your recent Articles</p>
    { article.size !== 0 ? 
        article.entrySeq().reverse().map(([key, value]) => 
        <div key={key} className="list-view__item">
            <div className="col_xs_2_5 total_view">
            <span className="view__item">{value.get('TotalDownload')}</span>
            <p className="view-item__caption">Views</p>
            </div>
            <div className="col_xs_10">
            <span className="view__item_name"><a href={'https://expertmile.com/arti.php?article_id=' + value.get('article_id')}>{value.get('article_name')}</a></span>
            <span className="time_ago">{value.get('Time_Ago')}</span>
            </div>
        </div>
     ) : 
     <div className="list-view__item"> 
          <p className="view__item_name__no">You have not shared any Article yet. Click on <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAEMAAABDAGWp/hQAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAASxQTFRF////AAD/VVWqK1WASW2SN22SRGaIQ2uGPW2GOmiLOWiOPmSLPGmHPmeKQGaGPmaIPWmLPGeIOmqKPWaKPGaLO2mJPWiKP2mKPWmIPGeIPGiLPWiKPWeJPGmKPGeKPWmIPmeJPmeKPGiJPWiJPGiJPWiJPmeJPmiJPWmIPWiKPWiJPWeJPWiJPWiJPWiJPWmJPmiJPmiIPWiJPmmKPWiJPWeJPWiJPmiJPWmJPWiJPWeIPGiJUY+yPWiJToqtVJO1PWiJSYChV5q9RnqcPWmIXafJQ3OVPWiKPWiJQG2PZrjaPWiJPWiJP2qLPWiJPWiJPWiJbMPnPWiJPWiJPWiJPWiJPWiJPWeJb8ruPWiJPWiJPWiJPWiJPWiJPWiJPWiJPWiJc9D0PWiJc9D0BnepPAAAAGJ0Uk5TAAEDBgcODxMVFhshIiUoLS4vMDI3ODs9S01RU1RVWVxjb3t9f4KIkZKWmp6gpqeoqq6xsrO0tba3uLm6v8DAwMHBwsTIyMrM0NTX2N3g4+Xm5ufq6+zt7/H1+Pn6+/z9/v4aXhBCAAABOUlEQVQ4y3XSd1eCUBzG8Z9iQ9vDtpaVLZtqu7RhpU1zpGHDHt7/ewguKHfA8xfnfD8HuByIPDew9nqZCJPvxj9Q/UFlyq+P1bEa7Eu2v+a9+2gNSGtEs5+NCNHc7p68GnIlJuI4JXqAugujaYtNLFERw8JiutkNRwxh3wTC80eqrDtiAucScPr7/Z0lMgUsiqDTX5Bn90A2KAC3X/8xcGi+KAeUfhwiHij9zeouUDqeiAdKz7QEoHZN54HSsxrxIFRGTu4CiAKlpmHc8ucXQAJVSzzecF0AO5hOs3uwfsTOL4DnlqbZwu086EeBiInO95XADNbJFlznQRJx8yowWQdOup0HZxjsXUhVzL/xwO0cCDR+r77NWk7Fos4iAgir/7XeIzxiZVvesvQdPNcFRZ+1bbAB321Z/R9JJrNeR2M9jQAAAABJRU5ErkJggg==" width="20" height="20" /> to share your first Article and get 25 miles for Free.</p>
    </div>
    }
  </div>
  )
}

export default Articles;
