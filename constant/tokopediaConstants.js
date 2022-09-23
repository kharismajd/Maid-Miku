const TOKOPEDIA_SID = process.env.TOKOPEDIA_SID

module.exports =  {
    GET_ORDER_URL: "https://gql.tokopedia.com/graphql/GetOrderHistory",
    GET_ORDER_OPERATION: "GetOrderHistory",
    GET_ORDER_QUERY: "query GetOrderHistory($VerticalCategory: String!, $Status: String!, $SearchableText: String!, $CreateTimeStart: String!, $CreateTimeEnd: String!, $Page: Int!, $Limit: Int!) {\n  uohOrders(input: {UUID: \"\", VerticalID: \"\", VerticalCategory: $VerticalCategory, Status: $Status, SearchableText: $SearchableText, CreateTime: \"\", CreateTimeStart: $CreateTimeStart, CreateTimeEnd: $CreateTimeEnd, Page: $Page, Limit: $Limit, SortBy: \"\", IsSortAsc: false}) {\n    orders {\n      orderUUID\n      verticalID\n      verticalCategory\n      userID\n      status\n      verticalStatus\n      searchableText\n      metadata {\n        upstream\n        verticalLogo\n        verticalLabel\n        paymentDate\n        paymentDateStr\n        queryParams\n        listProducts\n        detailURL {\n          webURL\n          webTypeLink\n          __typename\n        }\n        status {\n          label\n          textColor\n          bgColor\n          __typename\n        }\n        products {\n          title\n          imageURL\n          inline1 {\n            label\n            textColor\n            bgColor\n            __typename\n          }\n          inline2 {\n            label\n            textColor\n            bgColor\n            __typename\n          }\n          __typename\n        }\n        otherInfo {\n          actionType\n          appURL\n          webURL\n          label\n          textColor\n          bgColor\n          __typename\n        }\n        totalPrice {\n          value\n          label\n          textColor\n          bgColor\n          __typename\n        }\n        tickers {\n          action {\n            actionType\n            appURL\n            webURL\n            label\n            textColor\n            bgColor\n            __typename\n          }\n          title\n          text\n          type\n          isFull\n          __typename\n        }\n        buttons {\n          Label\n          variantColor\n          type\n          actionType\n          appURL\n          webURL\n          __typename\n        }\n        dotMenus {\n          actionType\n          appURL\n          webURL\n          label\n          textColor\n          bgColor\n          __typename\n        }\n        __typename\n      }\n      createTime\n      createBy\n      updateTime\n      updateBy\n      __typename\n    }\n    totalOrders\n    filtersV2 {\n      label\n      value\n      isPrimary\n      __typename\n    }\n    categories {\n      value\n      label\n      __typename\n    }\n    dateLimit\n    tickers {\n      action {\n        actionType\n        appURL\n        webURL\n        label\n        textColor\n        bgColor\n        __typename\n      }\n      title\n      text\n      type\n      isFull\n      __typename\n    }\n    __typename\n  }\n}\n",
    
    GET_ORDER_TRACKING_URL: "https://gql.tokopedia.com/graphql/logisticTracking",
    GET_ORDER_TRACKING_OPERATION: "logisticTracking",
    GET_ORDER_TRACKING_QUERY: "query logisticTracking($input: MpLogisticTrackingInputParams!) {\n  logistic_tracking(input: $input) {\n    config\n    message_error\n    status\n    data {\n      track_order {\n        change\n        status\n        no_history\n        track_history {\n          date_time\n          date\n          time\n          city\n          status\n          partner_name\n          proof {\n            image_id\n            copy_writing_disclaimer\n            __typename\n          }\n          __typename\n        }\n        receiver_name\n        order_status\n        detail {\n          shipper_city\n          shipper_name\n          receiver_city\n          receiver_name\n          send_date_time\n          send_date\n          send_time\n          service_code\n          tracking_url\n          eta {\n            is_updated\n            user_info\n            user_updated_info\n            __typename\n          }\n          __typename\n        }\n        shipping_ref_num\n        invalid\n        __typename\n      }\n      page {\n        additional_info {\n          title\n          notes\n          url_detail\n          url_text\n          __typename\n        }\n        __typename\n      }\n      last_driver {\n        photo\n        name\n        phone\n        license_number\n        is_changed\n        __typename\n      }\n      tipping {\n        status\n        status_title\n        status_subtitle\n        last_driver {\n          photo\n          name\n          phone\n          license_number\n          is_changed\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n",

    HEADER: {
        'authority': 'gql.tokopedia.com',
        'accept': '*/*',
        'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'content-type': 'application/json',
        'cookie': TOKOPEDIA_SID,
        'origin': 'https://www.tokopedia.com',
        'referer': 'https://www.tokopedia.com/order-list?status=diproses&page=1',
        'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
        'x-device': 'desktop',
        'x-source': 'tokopedia-lite',
        'x-tkpd-lite-service': 'zeus',
        'x-version': '7936adb'
    }
}
