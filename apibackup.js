var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'laravel'
})

router.get('/activity/:id', (req, res) => {
  const { id } = req.params
  pool.getConnection((err, connection) => {
    if (err) res.sendStatus(500)
    connection.query('SELECT Status_ID from timelinestatus s INNER JOIN proffesional p INNER JOIN ON s.Status_Creator = p.ID WHERE s.Status_Creator = ? ORDER BY s.Status_ID DESC LIMIT 10', [id], (err, result) => {
      if (err) res.sendStatus(500)
      let activity = {}
      if (result.length !== 0) {
        result.map((items) => {
          items['posted'] = true;
          items['commented'] = false;
          items['liked'] = false;
          activity[items.Status_ID] = items;
        })
      }
    })
    connection.release()
  })
})

router.get('/posts/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) return res.sendStatus(500)
    connection.query('SELECT Status_ID, Status_Type, Status_Creator, likes, dislikes, Status_Value, Status_Time, Fname, Lname, Organization, Designation, ProfilePic, Status, (SELECT statid FROM stat c WHERE c.statid=s.Status_ID AND c.userid = ? AND c.stat = 1 LIMIT 1) as liked FROM timelinestatus s INNER JOIN proffesional p ON s.Status_Creator = p.ID WHERE s.deleted != 1 ORDER BY s.Status_ID DESC LIMIT 10', [req.params.id], function (err, rows) {
      if (err) console.log(err)
      let count = rows.length
      let posts = {}
      rows.map((items) => {
        connection.query('SELECT Count(t.id) as Total_Comments, Comment_Creator, Comment_Date, t.id, Comment_Value, Fname, Lname, Organization, Designation, ProfilePic, (SELECT count(`id`) FROM comment_rating c WHERE c.commentid=t.id AND c.stat = 1) as helpful, (SELECT count(`id`) FROM comment_rating c WHERE c.commentid=t.id AND c.stat = 2) as nothelpful, (SELECT stat FROM comment_rating c WHERE c.commentid=t.id AND (c.stat = "1" OR c.stat = "2") AND c.userid = ?) as helpfuluser FROM timelinecomment t INNER JOIN proffesional p ON t.Comment_Creator = p.ID WHERE t.Comment_ID = ? AND t.deleted != 1 ORDER BY t.id DESC LIMIT 1', [req.params.id, items.Status_ID], (err, results) => {
          if (err) return res.sendStatus(500)
          results.map((comment) => {
            items['Total_Comments'] = comment.Total_Comments
            comment['Time_Ago'] = makeAgo(new Date(comment.Comment_Date).getTime() / 1000)
            if (comment.Total_Comments != 0) {
              items['comments'] = results
            } else {
              items['comments'] = []
            }
          })

          let shortStatus = items.Status_Value.substr(0, 200)
          let statusLength = items.Status_Value.length
          posts[items.Status_ID] = items
          items['Short_Status'] = shortStatus
          items['Status_Length'] = statusLength
          items['Time_Ago'] = makeAgo(new Date(items.Status_Time).getTime() / 1000)
          count--
          if (count < 1) {
            res.writeHead(200, {
              'content-type': 'application/json',
              'Cache-Control': 'no-cache'
            })
            res.write(JSON.stringify(posts))
            res.end()
          }
        })
      })
    })
    connection.release()
  })
})

router.get('/queries/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) return res.sendStatus(500)
    connection.query('SELECT Status_ID, Status_Type, Status_Creator, likes, dislikes, Status_Value, Status_Time, Fname, Lname, Organization, Designation, ProfilePic, Status, (SELECT statid FROM stat c WHERE c.statid=s.Status_ID AND c.userid = ? AND c.stat = 1 LIMIT 1) as liked FROM timelinestatus s INNER JOIN proffesional p ON s.Status_Creator = p.ID WHERE s.Status_Type="user_query" AND s.deleted != 1 ORDER BY s.Status_ID DESC LIMIT 10', [req.params.id], function (err, rows) {
      if (err) console.log(err)
      let count = rows.length
      let posts = {}
      rows.map((items) => {
        connection.query('SELECT Count(t.id) as Total_Comments, Comment_Creator, Comment_Date, t.id, Comment_Value, Fname, Lname, Organization, Designation, ProfilePic, (SELECT count(`id`) FROM comment_rating c WHERE c.commentid=t.id AND c.stat = 1) as helpful, (SELECT count(`id`) FROM comment_rating c WHERE c.commentid=t.id AND c.stat = 2) as nothelpful, (SELECT stat FROM comment_rating c WHERE c.commentid=t.id AND (c.stat = "1" OR c.stat = "2") AND c.userid = ?) as helpfuluser FROM timelinecomment t INNER JOIN proffesional p ON t.Comment_Creator = p.ID WHERE t.Comment_ID = ? AND t.deleted != 1 ORDER BY t.id DESC LIMIT 1', [req.params.id, items.Status_ID], (err, results) => {
          if (err) return res.sendStatus(500)
          results.map((comment) => {
            items['Total_Comments'] = comment.Total_Comments
            comment['Time_Ago'] = makeAgo(new Date(comment.Comment_Date).getTime() / 1000)
            if (comment.Total_Comments != 0) {
              items['comments'] = results
            } else {
              items['comments'] = []
            }
          })

          let shortStatus = items.Status_Value.substr(0, 200)
          let statusLength = items.Status_Value.length
          posts[items.Status_ID] = items
          items['Short_Status'] = shortStatus
          items['Status_Length'] = statusLength
          items['Time_Ago'] = makeAgo(new Date(items.Status_Time).getTime() / 1000)
          count--
          if (count < 1) {
            res.writeHead(200, {
              'content-type': 'application/json',
              'Cache-Control': 'public, max-age=31557600'
            })
            res.write(JSON.stringify(posts))
            res.end()
          }
        })
      })
    })
    connection.release()
  })
})

router.get('/posts/:page/:id', (req, res) => {
  let page = req.params.page
  let authorID = req.params.id
  let perPage = 10
  let startFrom = (page - 1) * perPage
  res.setHeader('content-type', 'application/json')
  res.setHeader('Cache-Control', 'public, max-age=31557600')

  pool.getConnection((err, connection) => {
    if (err) return res.sendStatus(500)
    connection.query('SELECT Status_ID, Status_Type, likes, dislikes, Status_Creator, Status_Value, Status_Time, Fname, Lname, Organization, Designation, Status, (SELECT statid FROM stat t WHERE t.statid = s.Status_ID AND t.userid = ? AND t.stat="1" LIMIT 1) as liked FROM timelinestatus s INNER JOIN proffesional p ON s.Status_Creator = p.ID WHERE s.deleted != 1 ORDER BY s.Status_ID DESC LIMIT ?, 10', [authorID, startFrom], function (err, rows) {
      if (err) return res.sendStatus(500)
      let count = rows.length
      let posts = {}
      rows.map((items) => {
        connection.query('SELECT Count(t.id) as Total_Comments, Comment_Creator, Comment_Date, t.id, Comment_Value, Fname, Lname, Organization, Designation, ProfilePic, (SELECT count(`id`) FROM comment_rating c WHERE c.commentid=t.id AND c.stat = 1) as helpful, (SELECT count(`id`) FROM comment_rating c WHERE c.commentid=t.id AND c.stat = 2) as nothelpful, (SELECT stat FROM comment_rating c WHERE c.commentid=t.id AND (c.stat = "1" OR c.stat = "2") AND c.userid = ?) as helpfuluser FROM timelinecomment t INNER JOIN proffesional p ON t.Comment_Creator = p.ID WHERE t.Comment_ID = ? AND t.deleted != 1 ORDER BY t.id DESC LIMIT 1', [authorID, items.Status_ID], (err, results) => {
          if (err) return res.sendStatus(500)
          results.map((comment) => {
            items['Total_Comments'] = comment.Total_Comments
            comment['Time_Ago'] = makeAgo(new Date(comment.Comment_Date).getTime() / 1000)
            if (comment.Total_Comments != 0) {
              items['comments'] = results
            } else {
              items['comments'] = []
            }
          })
          let shortStatus = items.Status_Value.substr(0, 200)
          let statusLength = items.Status_Value.length
          posts[items.Status_ID] = items
          items['Short_Status'] = shortStatus
          items['Status_Length'] = statusLength
          items['Time_Ago'] = makeAgo(new Date(items.Status_Time).getTime() / 1000)
          count--
          if (count < 1) {
            res.send(posts)
          }
        })
      })
    })
    connection.release()
  })
})

router.get('/queries/:page/:id', (req, res) => {
  let page = req.params.page
  let authorID = req.params.id
  let perPage = 10
  let startFrom = (page - 1) * perPage
  res.setHeader('content-type', 'application/json')
  res.setHeader('Cache-Control', 'public, max-age=31557600')

  pool.getConnection((err, connection) => {
    if (err) return res.sendStatus(500)
    connection.query('SELECT Status_ID, Status_Type, likes, dislikes, Status_Creator, Status_Value, Status_Time, Fname, Lname, Organization, Designation, Status, (SELECT statid FROM stat t WHERE t.statid = s.Status_ID AND t.userid = ? AND t.stat="1" LIMIT 1) as liked FROM timelinestatus s INNER JOIN proffesional p ON s.Status_Creator = p.ID WHERE s.Status_Type="user_query" AND s.deleted != 1 ORDER BY s.Status_ID DESC LIMIT ?, 10', [authorID, startFrom], function (err, rows) {
      if (err) return res.sendStatus(500)
      let count = rows.length
      let posts = {}
      rows.map((items) => {
        connection.query('SELECT Count(t.id) as Total_Comments, Comment_Creator, Comment_Date, t.id, Comment_Value, Fname, Lname, Organization, Designation, ProfilePic, (SELECT count(`id`) FROM comment_rating c WHERE c.commentid=t.id AND c.stat = 1) as helpful, (SELECT count(`id`) FROM comment_rating c WHERE c.commentid=t.id AND c.stat = 2) as nothelpful, (SELECT stat FROM comment_rating c WHERE c.commentid=t.id AND (c.stat = "1" OR c.stat = "2") AND c.userid = ?) as helpfuluser FROM timelinecomment t INNER JOIN proffesional p ON t.Comment_Creator = p.ID WHERE t.Comment_ID = ? AND t.deleted != 1 ORDER BY t.id DESC LIMIT 1', [authorID, items.Status_ID], (err, results) => {
          if (err) return res.sendStatus(500)
          results.map((comment) => {
            items['Total_Comments'] = comment.Total_Comments
            comment['Time_Ago'] = makeAgo(new Date(comment.Comment_Date).getTime() / 1000)
            if (comment.Total_Comments != 0) {
              items['comments'] = results
            } else {
              items['comments'] = []
            }
          })
          let shortStatus = items.Status_Value.substr(0, 200)
          let statusLength = items.Status_Value.length
          posts[items.Status_ID] = items
          items['Short_Status'] = shortStatus
          items['Status_Length'] = statusLength
          items['Time_Ago'] = makeAgo(new Date(items.Status_Time).getTime() / 1000)
          count--
          if (count < 1) {
            res.send(posts)
          }
        })
      })
    })
    connection.release()
  })
})

router.get('/post/detail/:postID/:authID', (req, res) => {
  res.setHeader('content-type', 'application/json')
  res.setHeader('Cache-Control', 'public, max-age=31557600')
  const {authID, postID } = req.params
  pool.getConnection(function (err, connection) {
    if (err) return res.sendStatus(500)

    connection.query('SELECT Status_ID, Status_Type, Status_Creator, likes, dislikes, Status_Value, Status_Time, Fname, Lname, ProfilePic, Organization, Designation, Status, (SELECT statid FROM stat c WHERE c.statid=s.Status_ID AND c.userid = ? AND c.stat = 1 LIMIT 1) as liked FROM timelinestatus s INNER JOIN proffesional p ON p.ID = s.Status_Creator WHERE s.Status_ID = ? AND deleted != 1', [authID, postID], function (err, rows) {
      if (err) return res.sendStatus(500)
      let posts = {}
      rows.map((items) => {
        connection.query('SELECT Comment_Date, t.id, Comment_Value, Comment_Creator, Fname, Lname, Organization, Designation, ProfilePic, (SELECT count(`id`) FROM comment_rating c WHERE c.commentid=t.id AND c.stat = 1) as helpful, (SELECT count(`id`) FROM comment_rating c WHERE c.commentid=t.id AND c.stat = 2) as nothelpful, (SELECT stat FROM comment_rating c WHERE c.commentid=t.id AND (c.stat = "1" OR c.stat = "2") AND c.userid = ?) as helpfuluser FROM timelinecomment t INNER JOIN proffesional p ON t.Comment_Creator = p.ID WHERE t.Comment_ID = ? AND t.deleted != 1 ORDER BY t.id', [req.params.id, items.Status_ID], function (err, results) {
          if (err) return res.sendStatus(500)
          results.map((comment) => {
            comment['Total_Comments'] = results.length
            comment['Time_Ago'] = makeAgo(new Date(comment.Comment_Date).getTime() / 1000)
          })
          items['Total_Comments'] = results.length
          let shortStatus = items.Status_Value.substr(0, 200)
          let statusLength = items.Status_Value.length
          items['Short_Status'] = shortStatus
          items['Status_Length'] = statusLength
          items['Time_Ago'] = makeAgo(new Date(items.Status_Time).getTime() / 1000)
          items['comments'] = results
          posts[items.Status_ID] = items
          res.json(posts)
        })
      })
    })
    connection.release()
  })
})

router.get('/comments/:authID/:postID', (req, res) => {
  res.setHeader('content-type', 'application/json')
  const { postID, authID } = req.params

  pool.getConnection(function (err, connection) {
    if (err) return res.sendStatus(500)
    connection.query('SELECT Comment_Date, t.id, Comment_Value, Comment_Creator, Fname, Lname, Organization, Designation, ProfilePic, (SELECT count(`id`) FROM comment_rating c WHERE c.commentid=t.id AND c.stat = 1) as helpful, (SELECT count(`id`) FROM comment_rating c WHERE c.commentid=t.id AND c.stat = 2) as nothelpful, (SELECT stat FROM comment_rating c WHERE c.commentid=t.id AND (c.stat = "1" OR c.stat = "2") AND c.userid = ?) as helpfuluser FROM timelinecomment t INNER JOIN proffesional p ON t.Comment_Creator = p.ID WHERE t.Comment_ID = ? AND t.deleted != 1 ORDER BY t.id', [authID, postID], function (err, comm) {
      if (err) return res.sendStatus(500)
      if (comm.length === 0) {
        return res.json(comm)
      } else {
        let comments = []
        comm.map(function (comment) {
          comment['Total_Comments'] = 1
          comment['Time_Ago'] = makeAgo(new Date(comment.Comment_Date).getTime() / 1000)
          comments.push(comment)
        })
        return res.json(comments)
      }
    })
    connection.release()
  })
})

router.post('/addComment/', (req, res) => {
  const {id, creator, text } = req.body
  pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500)
    } else {
      connection.beginTransaction((err) => {
        if (err) {
          res.sendStatus(err)
        }
        let comment = {
          Comment_ID: id,
          Comment_Creator: creator,
          Comment_Value: text,
          Comment_Date: new Date(),
          deleted: 0
        }
        connection.query('INSERT INTO timelinecomment SET ?', comment, (err, result) => {
          if (err) {
            return connection.rollback(() => {
              res.sendStatus(err)
            })
          }
          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                res.sendStatus(err)
              })
            }
          })
          let lastInstertedID = result.insertId

          connection.query('SELECT Comment_Date, t.id, Comment_Value, Comment_Creator, Fname, Lname, Organization, Designation, ProfilePic FROM timelinecomment t INNER JOIN proffesional p ON t.Comment_Creator = p.ID WHERE t.id = ?', [lastInstertedID], (err, comment) => {
            if (err) {
              return connection.rollback(() => {
                res.sendStatus(err)
              })
            }
            comment.map((value) => {
              value['Total_Comments'] = 1
              value['helpful'] = 0
              value['nothelpful'] = 0
              value['helpfuluser'] = null
              value['Time_Ago'] = makeAgo(new Date(value.Comment_Date).getTime() / 1000)
            })
            res.writeHead(200, {
              'content-type': 'application/json',
              'Cache-Control': 'public, max-age=31557600'
            })
            res.write(JSON.stringify(comment))
            res.end()
          })
        })
      })
    }
    connection.release()
  })
})

router.post('/addStatus/', (req, res) => {
  res.setHeader('content-type', 'application/json')
  res.setHeader('Cache-Control', 'public, max-age=31557600')
  const {id, post} = req.body
  if (req.body.id != '') {
    pool.getConnection(function (err, connection) {
      if (err) return res.sendStatus(500)
      let newPost = {
        Status_Creator: id,
        Status_Value: post,
        Status_Time: new Date(),
        likes: 0,
        dislikes: 0,
        deleted: 0
      }

      connection.beginTransaction((err) => {
        if (err) {
          res.sendStatus(err)
        } else {
          connection.query('INSERT INTO timelinestatus SET ?', newPost, (err, rows) => {
            if (err) {
              return connection.rollback(() => {
                res.sendStatus(err)
              })
            }
            connection.query('SELECT Status_ID, Status_Type, Status_Creator, likes, dislikes, Status_Value, Status_Time, Fname, Lname, Organization, Designation, ProfilePic, Status FROM timelinestatus s INNER JOIN proffesional p ON s.Status_Creator = p.ID WHERE s.Status_ID = ?', [rows.insertId], (err, result) => {
              if (err) {
                return connection.rollback(() => {
                  res.sendStatus(err)
                })
              }
              var post = {}
              result.map(function (items) {
                items['comments'] = []
                let shortStatus = items.Status_Value.substr(0, 200)
                let statusLength = items.Status_Value.length
                items['Short_Status'] = shortStatus
                items['liked'] = null
                items['Status_Length'] = statusLength
                items['Time_Ago'] = makeAgo(new Date(items.Status_Time).getTime() / 1000)
              })
              post[result[0].Status_ID] = result[0]
              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => {
                    res.sendStatus(err)
                  })
                }
                return res.json(post)
              })
            })
          })
        }
      })
      connection.release()
    })
  }
})

router.post('/editStatus/', (req, res) => {
  res.setHeader('content-type', 'application/json')
  res.setHeader('Cache-Control', 'public, max-age=31557600')
  const { postID, post } = req.body
  if (req.body.id != '') {
    pool.getConnection(function (err, connection) {
      if (err) return res.sendStatus(500)

      connection.beginTransaction((err) => {
        if (err) {
          res.sendStatus(err)
        } else {
          connection.query('UPDATE timelinestatus SET Status_Value = ? WHERE Status_ID = ?', [post, postID], (err) => {
            if (err) {
              return connection.rollback(() => {
                res.sendStatus(err)
              })
            }
            connection.query('SELECT Status_ID, Status_Type, Status_Creator, likes, dislikes, Status_Value, Status_Time, Fname, Lname, Organization, Designation, ProfilePic, Status FROM timelinestatus s INNER JOIN proffesional p ON s.Status_Creator = p.ID WHERE s.Status_ID = ?', [postID], (err, result) => {
              if (err) {
                return connection.rollback(() => {
                  res.sendStatus(err)
                })
              }
              var post = {}
              result.map(function (items) {
                items['comments'] = []
                let shortStatus = items.Status_Value.substr(0, 200)
                let statusLength = items.Status_Value.length
                items['Short_Status'] = shortStatus
                items['liked'] = null
                items['Status_Length'] = statusLength
                items['Time_Ago'] = makeAgo(new Date(items.Status_Time).getTime() / 1000)
              })
              post[result[0].Status_ID] = result[0]
              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => {
                    res.sendStatus(err)
                  })
                }
                return res.json(post)
              })
            })
          })
        }
      })
      connection.release()
    })
  }
})

router.post('/deleteStatus/', (req, res) => {
  res.setHeader('content-type', 'application/json')
  res.setHeader('Cache-Control', 'public, max-age=31557600')
  const { postID } = req.body
  if (postID != '') {
    pool.getConnection(function (err, connection) {
      if (err) return res.sendStatus(500)

      connection.beginTransaction((err) => {
        if (err) {
          res.sendStatus(err)
        } else {
          connection.query('UPDATE timelinestatus SET deleted = 1 WHERE Status_ID = ? ', [ postID ], (err) => {
            if (err) {
              return connection.rollback(() => {
                res.sendStatus(err)
              })
            }
            connection.commit((err) => {
              if (err) {
                return connection.rollback(() => {
                  res.sendStatus(err)
                })
              }
              res.sendStatus(200)
            })
          })
        }
      })
      connection.release()
    })
  }
})

router.post('/post/like/', (req, res) => {
  const { id, authID, currentValue } = req.body
  if (authID !== null && id !== null) {
    res.setHeader('content-type', 'application/json')
    pool.getConnection((err, connection) => {
      if (err) {
        res.sendStatus(500)
      } else {
        let like = {
          statid: id,
          userid: authID,
          stat: 1
        }
        connection.query('SELECT 1 FROM stat WHERE statid = ? AND userid = ? LIMIT 1', [id, authID], (err, result) => {
          if (err) {
            res.sendStatus(500)
          } else if (result.length > 0) {
            res.sendStatus(500)
          } else {
            connection.beginTransaction((err) => {
              if (err) {
                res.sendStatus(err)
              } else {
                connection.query('INSERT INTO stat SET ?', like, (err) => {
                  if (err) {
                    return connection.rollback(() => {
                      res.sendStatus(err)
                    })
                  }
                  connection.query('UPDATE timelinestatus SET likes = ? WHERE Status_ID = ?', [currentValue + 1, id], (err) => {
                    if (err) {
                      return connection.rollback(() => {
                        res.sendStatus(err)
                      })
                    }
                    connection.commit((err) => {
                      if (err) {
                        return connection.rollback(() => {
                          res.sendStatus(err)
                        })
                      }
                      return res.sendStatus(200)
                    })
                  })
                })
              }
            })
          }
        })
      }
      connection.release()
    })
  } else {
    return res.sendStatus(401)
  }
})

router.post('/post/unlike/', (req, res) => {

  const { id, authID, currentValue } = req.body
  if (authID !== null && id !== null) {
    res.setHeader('content-type', 'application/json')
    pool.getConnection((err, connection) => {
      if (err) {
        res.sendStatus(500)
      } else {
        connection.query('SELECT 1 FROM stat WHERE statid = ? AND userid = ? LIMIT 1', [id, authID], (err, result) => {
          if (err) {
            res.sendStatus(500)
          } else if (result.length !== 0) {
            connection.beginTransaction((err) => {
              if (err) {
                res.sendStatus(err)
              } else {
                connection.query('DELETE FROM `stat` WHERE statid = ? AND userid = ?', [id, authID], (err) => {
                  if (err) {
                    return connection.rollback(() => {
                      res.sendStatus(err)
                    })
                  }
                  connection.query('UPDATE timelinestatus SET likes = ? WHERE Status_ID = ?', [currentValue - 1, id], (err) => {
                    if (err) {
                      return connection.rollback(() => {
                        res.sendStatus(err)
                      })
                    }
                    connection.commit((err) => {
                      if (err) {
                        return connection.rollback(() => {
                          res.sendStatus(err)
                        })
                      }
                      return res.sendStatus(200)
                    })
                  })
                })
              }
            })
          } else {
            res.sendStatus(500)
          }
        })
      }
      connection.release()
    })
  } else {
    return res.sendStatus(401)
  }
})

router.post('/comment/helpful/', (req, res) => {
  res.setHeader('content-type', 'application/json')
  pool.getConnection((err, connection) => {
    if (err) res.sendStatus(500)
    connection.query('SELECT 1 FROM comment_rating WHERE userid = ? AND commentid = ?', [req.body.authID, req.body.commentID], (err, result) => {
      if (err) {
        res.sendStatus(200)
      } else if (result.length > 0) {
        connection.beginTransaction((err) => {
          if (err) {
            res.sendStatus(err)
          } else {
            connection.query('UPDATE comment_rating SET stat = ? WHERE userid = ? AND commentid = ?', [1, req.body.authID, req.body.commentID], (err) => {
              if (err) {
                return connection.rollback(() => {
                  res.sendStatus(err)
                })
              }
              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => {
                    res.sendStatus(err)
                  })
                }
                res.sendStatus(200)
              })
            })
          }
        })
      } else {
        connection.beginTransaction((err) => {
          if (err) {
            res.sendStatus(err)
          } else {
            let helpful = {
              userid: req.body.authID,
              commentid: req.body.commentID,
              stat: 1
            }
            connection.query('INSERT INTO comment_rating SET ?', helpful, (err) => {
              if (err) {
                return connection.rollback(() => {
                  res.sendStatus(err)
                })
              }
              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => {
                    res.sendStatus(err)
                  })
                }
                res.sendStatus(200)
              })
            })
          }
        })
      }
    })
    connection.release()
  })
})

router.post('/comment/improve/', (req, res) => {
  res.setHeader('content-type', 'application/json')
  pool.getConnection((err, connection) => {
    if (err) res.sendStatus(500)
    connection.query('SELECT 1 FROM comment_rating WHERE userid = ? AND commentid = ?', [req.body.authID, req.body.commentID], (err, result) => {
      if (err) {
        res.sendStatus(200)
      } else if (result.length > 0) {
        connection.query('UPDATE comment_rating SET stat = ? WHERE userid = ? AND commentid = ?', [2, req.body.authID, req.body.commentID], (err) => {
          if (err) {
            return connection.rollback(() => {
              res.sendStatus(err)
            })
          }
          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                res.sendStatus(err)
              })
            }
            res.sendStatus(200)
          })
        })
      } else {
        connection.beginTransaction((err) => {
          if (err) {
            res.sendStatus(err)
          } else {
            let improve = {
              userid: req.body.authID,
              commentid: req.body.commentID,
              stat: 2
            }
            connection.query('INSERT INTO comment_rating SET ?', improve, (err) => {
              if (err) {
                return connection.rollback(() => {
                  res.sendStatus(err)
                })
              }
              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => {
                    res.sendStatus(err)
                  })
                }
                res.sendStatus(200)
              })
            })
          }
        })
      }
    })
    connection.release()
  })
})

router.post('/comment/delete/', (req, res) => {
  res.setHeader('content-type', 'application/json')
  const { postID, commentID } = req.body
  pool.getConnection((err, connection) => {
    if (err) res.sendStatus(500)
    connection.beginTransaction((err) => {
      if (err) {
        res.sendStatus(err)
      } else {
        connection.query('DELETE FROM timelinecomment WHERE id=? AND Comment_ID=?', [commentID, postID], (err) => {
          if (err) {
            return connection.rollback(() => {
              res.sendStatus(err)
            })
          }
          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                res.sendStatus(err)
              })
            }
            res.sendStatus(200)
          })
        })
      }
    })
    connection.release()
  })
})

router.post('/pushData/', (req, res) => {
  res.sendStatus(200)
})

router.post('/notification/', (req, res) => {
  const { author, authorID, postID, authID } = req.body
  pool.getConnection((err, connection) => {
    if (err) res.sendStatus(500)
    if (author) {
      console.log('he is the author of the post')
      // send every other author a notification who has replied on this query

    } else {
      // send only author a notification who has posted this query

      connection.query('SELECT Subscription_Id from gcm WHERE User_id = ? LIMIT 1', [authorID], (err, result) => {
        if (err) res.sendStatus(500)
        if (result.length > 0) {
          // node gcm code goes here
          var message = new gcm.Message()
          // Add your mobile device registration tokens here
          var regTokens = [result[0].Subscription_Id]
          // Replace your developer API key with GCM enabled here
          var sender = new gcm.Sender('AIzaSyAC9olXkBagrE9tEuyImIwVfUjzzbRx-nk')

          sender.send(message, regTokens, function (err, response) {
            if (err) {
              console.error(err)
            } else {
              console.log(response)
              res.sendStatus(200)
            }
          })
        } else {
          console.log('unfortunately he has not subscribed to the notification api, send him message instead')
        }
      })
    }
    connection.release()
  })
})

router.post('/pushState/', (req, res) => {
  res.setHeader('content-type', 'application/json')
  const { subID, authID } = req.body
  pool.getConnection((err, connection) => {
    if (err) res.sendStatus(500)
    connection.beginTransaction((err) => {
      if (err) {
        res.sendStatus(err)
      } else {
        let subscription = {
          Subscription_Id: subID,
          User_id: authID
        }
        connection.query('SELECT 1 FROM  gcm WHERE User_id = ?', [authID], (err, result) => {
          if (err) res.sendStatus(500)
          if (result.length > 0) {
            connection.query('UPDATE gcm SET Subscription_Id = ? WHERE User_id = ?', [subID, authID], (err) => {
              if (err) {
                return connection.rollback(() => {
                  res.sendStatus(err)
                })
              }
              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => {
                    res.sendStatus(err)
                  })
                }
                res.sendStatus(200)
              })
            })
          } else {
            connection.query('INSERT INTO gcm SET ?', subscription, (err) => {
              if (err) {
                return connection.rollback(() => {
                  res.sendStatus(err)
                })
              }
              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => {
                    res.sendStatus(err)
                  })
                }
                res.sendStatus(200)
              })
            })
          }
        })
      }
    })
    connection.release()
  })
})

router.get('/myarticles/:id', (req, res) => {
  res.setHeader('content-type', 'application/json')
  res.setHeader('Cache-Control', 'public, max-age=86400')
  const { id } = req.params
  pool.getConnection((err, connection) => {
    if (err) res.sendStatus(500)
    connection.query('SELECT article_id, article_name, TotalDownload, Time from artical WHERE user_id = ? ORDER BY article_id DESC LIMIT 2', [id], (err, result) => {
      if (err) res.sendStatus(500)
      var articles = {}
      result.map(function (items) {
        items['Time_Ago'] = makeAgo(new Date(items.Time).getTime() / 1000)
        articles[items.article_id] = items
      })
      res.json(articles)
    })
    connection.release()
  })
})

router.post('/loadAuth', (req, res) => {
  res.setHeader('content-type', 'application/json')
  res.setHeader('Cache-Control', 'no-cache')
  return res.send({ id: 17, name: 'Nikesh Sheth', category: 'Finance' })
})

// router.post('/loadAuth', (req, res) => {
//   res.setHeader('content-type', 'application/json')
//   res.setHeader('Cache-Control', 'no-cache')
//   return res.send({ id: null, name: null, category: null })
// })
