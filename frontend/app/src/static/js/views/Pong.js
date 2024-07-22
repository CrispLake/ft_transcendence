/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Pong.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/02 06:33:29 by jmykkane          #+#    #+#             */
/*   Updated: 2024/07/02 06:47:18 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Pong');
  }

  async getHtml() {
    return `
      <script type="importmap">
			{
				"imports":
				{
					"three": "https://cdn.jsdelivr.net/npm/three@v0.165.0/build/three.module.js",
					"three/addons/": "https://cdn.jsdelivr.net/npm/three@v0.165.0/examples/jsm/"
				}
			}
		</script>
    <script type="module" src="/static/pong.js"></script>
    `
  }
  
}