var api_params =
{
// Article
	getArticleList: {
		params_in: ['viewSize','viewIndex'],
		params_out: {
			field_name: "entityList",
			field_type: "entityList",
			field_data: {}
		}
	},
	getArticleDetail:{
		params_in: ['articleId'],
		params_out: {
			field_name:"Article",
			field_type: "entity",
			field_data: {}
		}
	},
	createArticle:{
		params_in: 
			['articleId', 'articleTitle', 
			 'fromDate', 'thruDate', 
			 'sequenceNr', 'typeId', 'statusId', 
			 'description'],
		params_out: {
			field_name:"Article",
			field_type: "entity",
			field_data: {}
		}
	},
	updateArticle:{
		params_in: 
			['articleId', 'articleTitle', 
			 'fromDate', 'thruDate', 
			 'sequenceNr', 'typeId', 'statusId', 
			 'description'],
		params_out: {
			field_name:"Article",
			field_type: "entity",
			field_data: {}
		}
	},
	deleteArticle:{
		params_in: 
			['articleId'],
		params_out: {
			field_name:"Article",
			field_type: "entity",
			field_data: {}
		}
	},
	
	uploadMedia:{
		params_in: 
			['mediaId', 'parentMediaId',
			 'fromDate', 'thruDate', 
			 'sequenceNr', 'typeId', 'statusId', 
			 'description'],
		params_out: {
			field_name:"Article",
			field_type: "entity",
			field_data: {}
		}
	},

	
	
	
	
	getListMenu: {
		params_in: ['viewSize','viewIndex'],
		params_out: {
			field_name:"entityList",
			field_type: "entityListArray",
			field_key: "menuId",
			field_parent: "parentMenuId",
			field_data:{}
		}
	},
	getListMenuParent: {
		params_in: ['viewSize','viewIndex'],
		params_out: {
			field_name:"entityList",
			field_type: "entityList",
			field_data:{}
		}
	},
	getListMenuChildren: {
		params_in: ['parentMenuId', 'viewSize','viewIndex'],
		params_out: {
			field_name:"entityList",
			field_type: "entityList",
			field_data:{}
		}
	},
	
	getListCatalogProduct: {
		params_in: ['catalogId','viewSize','viewIndex'],
		params_out: {
			field_name:"entityList",
			field_type: "entityList",
			field_data:{}
		}
	},
	
	
	
	
	getListHub: {
		params_in: ['viewSize','viewIndex'],
		params_out: {
			field_name: "entityList",
			field_type: "entityList",
			field_data: {}
		}
	},
	getHub:{
		params_in: ['hubId'],
		params_out: {
			field_name:"Hub",
			field_type: "entity",
			field_data: {}
		}
	},
	
	getListBrand: {
		params_in: ['viewSize','viewIndex'],
		params_out: {
			field_name: "entityList",
			field_type: "entityList",
			field_data: {}
		}
	},
	getBrand:{
		params_in: ['brandId'],
		params_out: {
			field_name:"Brand",
			field_type: "entity",
			field_data: {}
		}
	},
	
	getListProduct: {
		params_in: ['viewSize','viewIndex','brandId','productId','productSku','productName','categoryId'],
		params_out: {
			field_name: "entityList",
			field_type: "entityList",
			field_data: {}
		}
	},
	getProduct:{
		params_in: ['productId'],
		params_out: {
			field_name:"Product",
			field_type: "entity",
			field_data: {}
		}
	},
	
	getListCategoryCategory: {
		params_in: ['viewSize','viewIndex'],
		params_out: {
			field_name:"entityList",
			field_type: "entityListArray",
			field_key: "categoryId",
			field_parent: "parentCategoryId",
			field_data:{}
		}
	},
	getListCategoryProductParent: {
		params_in: ['viewSize','viewIndex'],
		params_out: {
			field_name:"entityList",
			field_type: "entityList",
			field_data:{}
		}
	},
	getListCategoryProductChildren: {
		params_in: ['parentCategoryId', 'viewSize','viewIndex'],
		params_out: {
			field_name:"entityList",
			field_type: "entityList",
			field_data:{}
		}
	}


};
