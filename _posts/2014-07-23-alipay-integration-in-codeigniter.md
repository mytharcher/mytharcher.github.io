---
layout: post
title: CodeIgniter框架集成支付宝即时到账SDK
category: experience
tags: [CodeIgniter, 支付宝]

---

客户的网站需要支付功能，我们选择了业界用的最多的支付宝即时到账支付。申请了两次将近两周的时间终于下来了，于是我开始着手测试SDK整合支付流程。

SDK中的代码并不复杂，就是构造请求发送，接收并验证签名而已。SDK根目录中的文件基本是示例，开发的时候用于参照，`lib`目录中是核心库文件，在CodeIgniter中需要把这个目录放到`application/third_party`目录下，并将目录名改为`alipay`方便标识，证书文件`cacert.pem`也放进去。其实更好的方式是把类文件放到`application/libraries`目录并使用Loader加载类库，但是其中有两个公共函数文件引用，省的加载麻烦就直接`require_once()`了。

配置文件也需要单独增加一个`alipay.php`在`application/config`目录中，主要可以照搬示例中的`alipay.config.php`的内容，我是这么写的：

	$config['partner']      = '商户id';
	$config['key']          = '商户API key';
	$config['seller_email'] = '商户支付宝邮箱账号';
	$config['payment_type'] = 1;
	$config['transport'] = 'http';
	$config['input_charset'] = 'utf-8';
	$config['sign_type'] = 'MD5';
	$config['notify_url'] = 'http://'.$_SERVER['HTTP_HOST'].'/order/callback/notify';
	$config['return_url'] = 'http://'.$_SERVER['HTTP_HOST'].'/order/callback/return';
	$config['cacert'] = APPPATH.'third_party/alipay/cacert.pem';

之后就是在订单控制器中处理支付了，当创建了一个商品订单后，给用户一个链接按钮，跳转到`/order/pay`控制器进行支付宝请求中转，主要可以参照示例`alipayapi.php`文件内容，调用SDK函数生成一个提交表单，渲染在模板中由JS控制自动提交。

	// 订单控制器类
	class Order extends CI_Controller{
		// ...
		public function pay($id) {
			// 获取订单数据示例
			$order = $this->model->get($id);

			// 加载支付宝配置
			$this->config->load('alipay', TRUE);
			// 加载支付宝支付请求类库
			require_once(APPPATH."third_party/alipay/alipay_submit.class.php");

			$submit = new AlipaySubmit($this->config->item('alipay'));

			$body = $submit->buildRequestForm(array(
				'service'           => 'create_direct_pay_by_user',
				'partner'           => $this->config->item('partner', 'alipay'),
				'payment_type'      => $this->config->item('payment_type', 'alipay'),
				'notify_url'        => $this->config->item('notify_url', 'alipay'),
				'return_url'        => $this->config->item('return_url', 'alipay'),
				'seller_email'      => $this->config->item('seller_email', 'alipay'),
				'out_trade_no'      => $id,
				'subject'	        => $order['product']['name'],
				'total_fee'         => $order['price'],
				'body'              => $order['product']['name'],
				'show_url'          => 'http://'.$_SERVER['HTTP_HOST'].'/product/view/'.$order['productId'],
				'anti_phishing_key' => '',
				'exter_invoke_ip'   => '',
				'_input_charset'    => $this->config->item('input_charset', 'alipay')
			));

			// 渲染模板，原生的这么写，我自己另外用smarty3
			$this->load->view('pay', array('body' => $body));
		}
		// ...
	}

正常的话用户浏览器会跳转到支付宝完成支付，之后再跳转回之前配置了的`return_url`上，这个控制器方法我命名为`/order/callback/<method>`，通过参数指定是同步返回还是异步通知，但里面的业务逻辑处理差不多。

	// 还是订单控制器类
	class Order extends CI_Controller{
		// $method参数只能是'return'或'notify'，对应URL
		public function callback ($method) {
			// 加载支付宝配置
			$this->config->load('alipay', TRUE);
			// 加载支付宝返回通知类库
			require_once(APPPATH."third_party/alipay/alipay_notify.class.php");
			// 初始化支付宝返回通知类
			$alipayNotify = new AlipayNotify($this->config->item('alipay'));

			$input = array();
			$is_ajax = FALSE;
			$notify_status = 'success';

			// 这里做同步还是异步的判断并获取返回数据验证请求
			switch ($method) {
				case 'notify':
					$result = $alipayNotify->verifyNotify();
					$input = $this->input->post();
					$is_ajax = TRUE;
					break;

				case 'return':
					$result = $alipayNotify->verifyReturn();
					$input = $this->input->get();
					break;
				
				default:
					return $this->out_not_found();
					break;
			}

			// 支付宝返回支付成功和交易结束标志
			if ($result && ($input['trade_status'] == 'TRADE_FINISHED' || $input['trade_status'] == 'TRADE_SUCCESS')) {
				$id = $input['out_trade_no'];

				// 验证成功则更新订单信息（略）
				// ...
			} else {
				// 否则置状态为失败
				$notify_status = 'fail';
			}

			if ($is_ajax) {
				// 异步方式调用模板输出状态
				$this->view->load('alipay', array('status' => $notify_status));
			} else {
				// 同步方式跳转到订单详情控制器，redirect方法要你自己写
				return $this->redirect("order/view/$id#status:$notify_status");
			}
		}
	}

到这正常的话数据库已经更新订单信息，后台管理也就可以根据支付情况去后面的配送流程。但问题是，在CI中正常情况根本到不了这里！所以我要开始吐槽支付宝的SDK！

## 会遇到的问题 ##

### PHP cURL模块未安装 ###

VPS用的ubuntu系统，默认PHP的cURL模块没有，需要命令行安装：

	$ sudo apt-get install curl php5-curl

好吧，这是我没有看`readme.txt`文档，然后`var_dump()`花了三分钱才找到这个问题。

### MD5签名验证不通过 ###

这才是真正坑爹的问题！之前测试一直是支付成功但返回调用验证失败，直到我一步一步跟到SDK的源码里去对比要验证的签名串，才发现这根本就是SDK的一个BUG！请看`alipay_core.function.php`文件的`paraFilter`函数，这个函数的作用是过滤掉签名参数和空值参数，以便生成签名串。原来的SDK是这么写的：

	function paraFilter($para) {
		$para_filter = array();
		// 问题就在这
		while (list ($key, $val) = each ($para)) {
			if($key == "sign" || $key == "sign_type" || $val == "")continue;
			else	$para_filter[$key] = $para[$key];
		}
		return $para_filter;
	}

问题就出在`while`循环的条件里，每次过滤参数，这里直接就把第一个返回参数`body=xxx`给过滤掉了，一旦我加上`body=xxx`变成完整的签名参数，生成的MD5签名就能对上。我百思不得其解的时候去查了PHP的文档，根据`each`方法说明，每调用一次游标就会发生改变，而首次调用之前没有调用`reset()`的话，就很可能被之前调用过这个数组的`each()`给弄错游标。而每次代码中每次都是从第二个参数开始，说明数组可能已经被其他程序调用过了。这个数组实际上是系统变量`$_GET`，CI框架中在处理输入数据的XSS安全过滤上调用过`each`方法，但这并不能成为支付宝SDK调用错误的借口。所以我想说的是：**好！好！写！个！`foreach`！循环会死么！**修改后的代码如下：

	function paraFilter($para) {
		// 增加这一行
		reset($para);
		$para_filter = array();
		while (list ($key, $val) = each ($para)) {
			if($key == "sign" || $key == "sign_type" || $val == "")continue;
			else	$para_filter[$key] = $para[$key];
		}
		return $para_filter;
	}

这才算解决了签名不正确的问题。

另外，看了SDK源码才发现，支付宝的PHP程序员英文真是烂，各种拼写错误，比如：verify写成veryfy，sign写成sgin……实在是无力吐槽。

好了，我把修改过的SDK包放在GitHub上了：<https://github.com/mytharcher/alipay-php-sdk>，有需要请自取。

-EOF-
