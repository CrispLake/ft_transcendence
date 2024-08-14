/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   CustomError.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/22 15:20:28 by jmykkane          #+#    #+#             */
/*   Updated: 2024/07/22 15:20:36 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'CustomError';
    this.status = status;
  }
}