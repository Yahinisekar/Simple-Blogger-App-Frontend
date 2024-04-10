import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../App';
import { FilterPagination } from '../common/FilterPagination';
import Loader from '../components/Loader';
import Animation from '../common/Animation';
import NoData from '../components/NoData';
import NotificationCard from '../components/NotificationCard';
import LoadMore from '../components/LoadMore';

const NotificationPage = () => {

    const [filter, setFilter] = useState('all')
    const [notifications, setNotifications] = useState(null);
    let filters = ['all', 'like', 'comment', 'reply'];

    let {userAuth,userAuth:{accessToken,new_notification_available},setuserAuth } = useContext(userContext);

    const fetchNotifications = ({page,deletedCount =0}) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/notifications', { page, filter, deletedCount }, {
            headers: {
              'Authorization':`Bearer ${accessToken}`
          }
        }).then(async ({ data: { notifications: data } }) => {
            // console.log(data);
            if (new_notification_available) {
         setuserAuth({...userAuth,new_notification_available : false})

            }

            let formatedData = await FilterPagination({

                
                state: notifications,
                data, page, countRoute: "/all-notifications-count",
                data_to_send: { filter }, user: accessToken
            }) 
            setNotifications(formatedData)
            // console.log(formatedData);

        }).catch(err => {
            console.log(err);
      })
   }
    const handleFilter = (e) => {
        let btn = e.target;
        
        setFilter(btn.innerText);
        setNotifications(null);
    }

    useEffect(() => {
        if (accessToken) { 
            fetchNotifications({ page: 1 })
            // setNotifications(null);
        }


    },[accessToken,filter])

  return (
      <div>
          <h1 className='max-md:hidden'> Recent Notifications</h1>
          <div className=' flex capitalize max-sm:gap-0  max-sm:py-0 gap-6'>
              {
                  filters.map((filterName, i) => {
                      return (
                        <button
                          key={i}
                          className={
                            filter == filterName
                              ? " btn-dark  max-sm:text-sm max-sm:px-3 "
                              : " btn-light  max-sm:text-sm max-sm:px-3 "
                          }
                          onClick={handleFilter}
                        >
                          {" "}
                          {filterName}
                        </button>
                      );
                  })
              }
              
          </div>
          {
              notifications == null ? <Loader /> : 
                  <>
                      {
                          notifications.results.length ? notifications.results.map((notification, i) => {
                              return <Animation key={i} transition= {{ delay:i*0.08}}>
                                  <NotificationCard data={notification} index={i} notificationState={{ notifications, setNotifications }} /> 
                              </Animation>
                          }) :<NoData message="Nothing Available"/>
                      }
                      <LoadMore state={notifications} fetchData={fetchNotifications} additionalParam={{deletedCount :notifications.deletedCount} } />
                  </>
          }
    </div>
  )
}

export default NotificationPage