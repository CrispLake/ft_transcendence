/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Result.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/22 13:36:52 by jmykkane          #+#    #+#             */
/*   Updated: 2024/08/01 17:43:22 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Notification } from "../notification.js";
import AbstractView from "./AbstractView.js";

/*

PARAMETERS:
params (obj)
{
  gameMode: int (1-4)
  
}

*/


export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Game finished!');
  }


  AddListeners() {
    
  }

  RemoveListeners() {
    
  }

  async getHtml() {
    return `
      
    `;
  }
  
}